// scripts.js — provides navigation, hero slider, gallery lightbox, form behavior, and small interactions
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* NAV TOGGLE */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('open');
    });
  }

  /* ACTIVE NAV LINK */
  const navLinks = document.querySelectorAll('.nav a');
  const currentName = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentName) a.classList.add('active');
  });

  /* HERO SLIDER */
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const interval = Number(slider.dataset.interval) || 5000;
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, interval);
  }

  /* GALLERY LIGHTBOX */
  const galleryImages = document.querySelectorAll('.gallery-grid img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const closeBtn = lightbox?.querySelector('.close');
  const prevBtn = lightbox?.querySelector('.prev');
  const nextBtn = lightbox?.querySelector('.next');
  let currentIndex = -1;

  function openLightbox(i) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = i;
    lightboxImg.src = galleryImages[i].src;
    lightboxImg.alt = galleryImages[i].alt || '';
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext(offset = 1) {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex + offset + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  }

  galleryImages.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
    });
    img.setAttribute('tabindex', '0');
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => showNext(-1));
  nextBtn?.addEventListener('click', () => showNext(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext(1);
    if (e.key === 'ArrowLeft') showNext(-1);
  });

  // Clicking the overlay closes (unless clicking the image or buttons)
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* CONTACT FORM */
  const contactForm = document.getElementById('contact-form');
  const contactFeedback = document.getElementById('contact-feedback');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#name')?.value?.trim();
      const email = contactForm.querySelector('#email')?.value?.trim();
      const message = contactForm.querySelector('#message')?.value?.trim();

      if (!name || !email) {
        contactFeedback.textContent = 'Please add your name and email.';
        contactFeedback.classList.remove('hidden');
        return;
      }

      // simple email check
      const emailRe = /\S+@\S+\.\S+/;
      if (!emailRe.test(email)) {
        contactFeedback.textContent = 'Please enter a valid email address.';
        contactFeedback.classList.remove('hidden');
        return;
      }

      // simulate successful submit
      contactFeedback.textContent = 'Thanks! Your message was received.';
      contactFeedback.classList.remove('hidden');
      contactForm.reset();
      // store name/email locally for convenience
      try { localStorage.setItem('contactName', name); localStorage.setItem('contactEmail', email); } catch (err) {}
    });

    // prefill if available
    try {
      const savedName = localStorage.getItem('contactName');
      const savedEmail = localStorage.getItem('contactEmail');
      if (savedName) contactForm.querySelector('#name').value = savedName;
      if (savedEmail) contactForm.querySelector('#email').value = savedEmail;
    } catch (err) {}
  }

  /* SERVICES: expandable rows */
  document.querySelectorAll('tr.expandable').forEach((row) => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const next = row.nextElementSibling;
      if (!next) return;
      next.classList.toggle('hidden');
    });
  });

  /* BLOG: load more */
  const loadMore = document.getElementById('load-more');
  if (loadMore) {
    loadMore.addEventListener('click', () => {
      document.querySelectorAll('.posts .post.hidden').forEach(p => p.classList.remove('hidden'));
      loadMore.remove();
    });
  }
});