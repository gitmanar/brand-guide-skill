/* ============================================
   Brand Guide — Interactive Scripts
   ============================================ */

(function () {
  'use strict';

  // --- Dark Mode Toggle ---
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    // Check saved preference
    const saved = localStorage.getItem('brand-guide-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('brand-guide-theme', next);
    });
  }

  // --- Click-to-Copy Color Swatches ---
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const hex = swatch.getAttribute('data-hex');
      if (!hex) return;

      navigator.clipboard.writeText(hex).then(() => {
        let toast = swatch.querySelector('.copy-toast');
        if (!toast) {
          toast = document.createElement('span');
          toast.className = 'copy-toast';
          swatch.appendChild(toast);
        }
        toast.textContent = 'Copied!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1200);
      });
    });
  });

  // --- Smooth Scroll Navigation ---
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');

  // Active nav highlighting on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -80% 0px' });

  sections.forEach(section => observer.observe(section));

  // --- Token Tabs ---
  const tokenTabs = document.querySelectorAll('.token-tab');
  const tokenPanels = document.querySelectorAll('.token-panel');

  tokenTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tokenTabs.forEach(t => t.classList.remove('active'));
      tokenPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // --- Contrast Ratio Display ---
  // Utility to calculate contrast ratio between two hex colors
  function hexToRGB(hex) {
    hex = hex.replace('#', '');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16)
    };
  }

  function luminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  function contrastRatio(hex1, hex2) {
    const c1 = hexToRGB(hex1), c2 = hexToRGB(hex2);
    const l1 = luminance(c1.r, c1.g, c1.b);
    const l2 = luminance(c2.r, c2.g, c2.b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  // Expose for use by generated content
  window.brandGuide = { contrastRatio, hexToRGB, luminance };
})();
