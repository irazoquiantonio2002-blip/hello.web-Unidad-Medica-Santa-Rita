document.addEventListener('DOMContentLoaded', () => {

  /* ============ LOADER ============ */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('loaded');
      document.body.style.overflow = '';
    }, 900);
  });

  /* ============ NAVBAR SCROLL STATE ============ */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ MOBILE MENU ============ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  let overlay = document.getElementById('nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    document.body.appendChild(overlay);
  }
  const toggleMenu = (open) => {
    mobileMenu.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  hamburger?.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
  overlay.addEventListener('click', () => toggleMenu(false));
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* ============ SCROLL REVEAL ============ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ============ ANIMATED COUNTERS ============ */
  const counters = document.querySelectorAll('[data-target]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ============ FAQ ACCORDION ============ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-btn');
    btn?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.closest('.faq-wrap')?.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ============ RIPPLE EFFECT ============ */
  document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,.5);transform:scale(0);
        animation:rippleAnim .6s ease-out;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes rippleAnim{to{transform:scale(2.4);opacity:0;}}';
  document.head.appendChild(rippleStyle);

  /* ============ SMOOTH ANCHOR SCROLL (offset for fixed navbar) ============ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============ LIGHTBOX (flyers / infografías) ============ */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = lightboxModal?.querySelector('.lightbox-img');
  const lightboxClose = lightboxModal?.querySelector('.lightbox-close');

  const openLightbox = (src, alt) => {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ============ HERO CANVAS PARTICLES ============ */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    const resize = () => {
      const hero = document.getElementById('hero');
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    };

    const initParticles = () => {
      const count = Math.min(60, Math.floor((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.15
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(127,220,232,${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();
    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });
  }

});
