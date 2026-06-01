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

  // --- Photo upload ---
  const uploadZone  = document.getElementById('upload-zone');
  const fileInput   = document.getElementById('photo-upload');
  const fileList    = document.getElementById('file-list');
  let selectedFiles = [];

  function formatBytes(bytes) {
    return bytes < 1024 * 1024
      ? (bytes / 1024).toFixed(0) + ' KB'
      : (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function renderFileList() {
    if (!fileList) return;
    if (selectedFiles.length === 0) {
      fileList.hidden = true;
      fileList.innerHTML = '';
      return;
    }
    fileList.hidden = false;
    fileList.innerHTML = selectedFiles.map((f, i) => `
      <li class="file-item">
        <span class="file-item-name">${f.name}</span>
        <span class="file-item-size">${formatBytes(f.size)}</span>
        <button type="button" class="file-item-remove" data-index="${i}" aria-label="Remove ${f.name}">&times;</button>
      </li>
    `).join('');

    fileList.querySelectorAll('.file-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedFiles.splice(Number(btn.dataset.index), 1);
        renderFileList();
      });
    });
  }

  function addFiles(newFiles) {
    const MAX_SIZE = 10 * 1024 * 1024;
    const ALLOWED  = /\.(jpe?g|png|webp|heic|pdf)$/i;
    Array.from(newFiles).forEach(f => {
      if (!ALLOWED.test(f.name)) return;
      if (f.size > MAX_SIZE) return;
      if (!selectedFiles.some(existing => existing.name === f.name && existing.size === f.size)) {
        selectedFiles.push(f);
      }
    });
    renderFileList();
  }

  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
    fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });

    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      addFiles(e.dataTransfer.files);
    });
  }

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
