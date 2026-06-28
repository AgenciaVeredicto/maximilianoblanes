/* main.js — Dr. Maximiliano Blanes */
'use strict';

/* ── Doctor photo: mostrar placeholder hasta que cargue la imagen real ── */
(function () {
  const img         = document.getElementById('doctor-img');
  const placeholder = document.getElementById('doctor-placeholder');
  if (!img || !placeholder) return;

  function showPlaceholder() {
    img.style.display = 'none';
    placeholder.classList.remove('hidden');
  }

  function hidePlaceholder() {
    placeholder.classList.add('hidden');
  }

  if (img.complete && img.naturalWidth > 0) {
    hidePlaceholder();
  } else if (img.complete && img.naturalWidth === 0) {
    showPlaceholder();
  } else {
    img.addEventListener('load',  hidePlaceholder);
    img.addEventListener('error', showPlaceholder);
  }
})();

/* ── Nav mobile: toggle del drawer ── */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', function () {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    drawer.hidden = open;
    document.body.style.overflow = open ? '' : 'hidden';
  });

  /* Cerrar al hacer click en un link del drawer */
  drawer.querySelectorAll('[data-close]').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
      document.body.style.overflow = '';
    });
  });

  /* Cerrar con Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
})();

/* ── Scroll-reveal con IntersectionObserver ── */
(function () {
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
  );

  document.querySelectorAll(
    '.area-card, .reason-item, .contact-data-item, .section-header, .doctor-bio, .doctor-photo-col, .testimonial, .rating-block'
  ).forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();

/* ── Formulario: submit placeholder ── */
(function () {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');
  if (!form || !submitBtn || !successMsg) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre    = form.querySelector('#nombre');
    const situacion = form.querySelector('#situacion');

    if (!nombre.value.trim())    { nombre.focus();    return; }
    if (!situacion.value.trim()) { situacion.focus(); return; }

    /*
      TODO: reemplazar con fetch real al backend.
      Opciones:
        1. Cloudflare Pages Functions → /functions/contact.js
        2. Formspree               → action="https://formspree.io/f/TU_ID"
        3. EmailJS                 → emailjs.sendForm(serviceId, templateId, form)
    */
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Enviando…';

    setTimeout(function () {
      form.reset();
      submitBtn.hidden   = true;
      successMsg.hidden  = false;
    }, 800);
  });
})();
