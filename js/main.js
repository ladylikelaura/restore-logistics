// ============================================================
// RESTORE LOGISTICS — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky header on scroll ---
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile nav ---
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav  = document.getElementById('nav-mobile');
  const mobileClose= document.getElementById('nav-mobile-close');

  function openMobileNav() {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMobileNav);
  mobileClose?.addEventListener('click', closeMobileNav);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // --- FAQ Accordion ---
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item   = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all open items
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        item.querySelector('.accordion-body').style.maxHeight =
          item.querySelector('.accordion-body-inner').scrollHeight + 'px';
      }

      // Reset heights for closed items
      document.querySelectorAll('.accordion-item:not(.open) .accordion-body').forEach(b => {
        b.style.maxHeight = '0';
      });
    });
  });

  // --- Quote form submission (basic) ---
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = quoteForm.querySelector('.form-submit');
      btn.textContent = 'Sent! We\'ll be in touch soon.';
      btn.disabled = true;
      btn.style.background = '#22c55e';
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Simple fade-in on scroll ---
  const fadeEls = document.querySelectorAll(
    '.service-card, .step, .problem-tile, .location-card, .proof-card, .stat-item'
  );
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = entry.target.style.transform.replace('translateY(20px)', 'translateY(0)');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => {
      el.style.opacity   = '0';
      el.style.transform = (el.style.transform || '') + ' translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      io.observe(el);
    });
  }

});
