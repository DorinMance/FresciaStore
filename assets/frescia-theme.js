/* ============================================================
   FRESCIA THEME — JavaScript Principal
   fresciastore.ro
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. STICKY NAV ──────────────────────────────────────── */
  const StickyNav = {
    init() {
      const navbar = document.querySelector('.frescia-navbar');
      if (!navbar) return;

      const topbar = document.querySelector('.frescia-topbar');
      const topbarH = topbar ? topbar.offsetHeight : 0;

      const sentinel = document.createElement('div');
      sentinel.style.cssText = `position:absolute;top:${topbarH}px;height:1px;width:100%;pointer-events:none`;
      document.body.prepend(sentinel);

      const obs = new IntersectionObserver(
        ([entry]) => navbar.classList.toggle('is-scrolled', !entry.isIntersecting),
        { threshold: 0 }
      );
      obs.observe(sentinel);
    }
  };

  /* ── 2. MOBILE MENU ─────────────────────────────────────── */
  const MobileMenu = {
    init() {
      const hamburger = document.querySelector('.frescia-hamburger');
      const menu      = document.querySelector('.frescia-mobile-menu');
      const overlay   = document.querySelector('.frescia-mobile-menu__overlay');
      const closeBtn  = document.querySelector('.frescia-mobile-menu__close');
      if (!hamburger || !menu) return;

      const open  = () => { menu.classList.add('is-open');  hamburger.classList.add('is-open');  document.body.style.overflow = 'hidden'; };
      const close = () => { menu.classList.remove('is-open'); hamburger.classList.remove('is-open'); document.body.style.overflow = ''; };

      hamburger.addEventListener('click', () => menu.classList.contains('is-open') ? close() : open());
      if (overlay) overlay.addEventListener('click', close);
      if (closeBtn) closeBtn.addEventListener('click', close);

      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }
  };

  /* ── 3. SIDEBAR ACCORDION ───────────────────────────────── */
  const SidebarAccordion = {
    init() {
      document.querySelectorAll('.frescia-sidebar__accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const body    = trigger.nextElementSibling;
          const isOpen  = trigger.classList.contains('is-active');

          /* close all siblings */
          const parent = trigger.closest('.frescia-sidebar__section');
          if (parent) {
            parent.querySelectorAll('.frescia-sidebar__accordion-trigger').forEach(t => {
              t.classList.remove('is-active');
              const b = t.nextElementSibling;
              if (b) b.classList.remove('is-open');
            });
          }

          if (!isOpen) {
            trigger.classList.add('is-active');
            if (body) body.classList.add('is-open');
          }
        });
      });
    }
  };

  /* ── 4. HERO VIDEO — blur + text reveal la sfârsit ────────── */
  const HeroVideo = {
    init() {
      const hero  = document.getElementById('frescia-hero');
      const video = document.getElementById('hero-video');
      const btn   = document.getElementById('hero-play-btn');
      if (!hero) return;

      /* Vizitator care revine — skip video, conținut instant */
      if (hero.classList.contains('frescia-hero--instant')) return;

      /* Fără video → text imediat vizibil */
      if (!video) {
        hero.classList.add('frescia-hero--no-video');
        return;
      }

      const iconPlay  = btn ? btn.querySelector('.icon-play')  : null;
      const iconPause = btn ? btn.querySelector('.icon-pause') : null;

      const updateIcon = () => {
        if (!btn) return;
        if (iconPlay)  iconPlay.style.display  = video.paused ? 'block' : 'none';
        if (iconPause) iconPause.style.display = video.paused ? 'none'  : 'block';
      };

      /* Video s-a terminat → activează efectul blur + reveal text */
      video.addEventListener('ended', () => {
        sessionStorage.setItem('frescia-hero-seen', '1');
        hero.classList.add('frescia-hero--ended');
        updateIcon();
      });

      /* Fallback: dacă video nu pornește în 15s → afișează textul oricum */
      const fallbackTimer = setTimeout(() => {
        if (!hero.classList.contains('frescia-hero--ended')) {
          sessionStorage.setItem('frescia-hero-seen', '1');
          hero.classList.add('frescia-hero--ended');
        }
      }, 15000);

      video.addEventListener('ended', () => clearTimeout(fallbackTimer));

      /* Play/Pause după reveal */
      if (btn) {
        btn.addEventListener('click', () => {
          video.paused ? video.play() : video.pause();
          updateIcon();
        });
      }

      updateIcon();
    }
  };

  /* ── 5. AJAX CART ───────────────────────────────────────── */
  const AjaxCart = {
    init() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-add-to-cart]');
        if (!btn) return;
        e.preventDefault();

        const variantId = btn.dataset.variantId || btn.dataset.addToCart;
        if (!variantId) return;

        this.addItem(variantId, btn);
      });
    },

    addItem(variantId, btn) {
      btn.classList.add('is-loading');
      btn.disabled = true;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: parseInt(variantId, 10), quantity: 1 })
      })
      .then(res => {
        if (!res.ok) throw new Error('Add to cart failed');
        return fetch('/cart.js');
      })
      .then(res => res.json())
      .then(cart => {
        CartBadge.update(cart.item_count);
        Toast.show(window.frTheme?.addedToCart || 'Produs adăugat în coș!', 'success');
      })
      .catch(() => {
        Toast.show(window.frTheme?.cartError || 'Eroare. Încearcă din nou.', 'error');
      })
      .finally(() => {
        btn.classList.remove('is-loading');
        btn.disabled = false;
        btn.innerHTML = originalText;
      });
    }
  };

  /* ── 6. CART BADGE ──────────────────────────────────────── */
  const CartBadge = {
    update(count) {
      document.querySelectorAll('.frescia-nav__badge').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      });
    },

    init() {
      fetch('/cart.js')
        .then(r => r.json())
        .then(cart => this.update(cart.item_count))
        .catch(() => {});
    }
  };

  /* ── 7. TOAST NOTIFICATION ──────────────────────────────── */
  const Toast = {
    el: null,
    timeout: null,

    create() {
      if (this.el) return;
      this.el = document.createElement('div');
      this.el.className = 'frescia-toast';
      this.el.innerHTML = `
        <span class="frescia-toast__icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
        <span class="frescia-toast__message"></span>
      `;
      document.body.appendChild(this.el);
    },

    show(message, type = 'success') {
      this.create();
      const msg = this.el.querySelector('.frescia-toast__message');
      if (msg) msg.textContent = message;

      this.el.style.background = type === 'error' ? '#c0392b' : 'var(--color-primary)';

      clearTimeout(this.timeout);
      this.el.classList.add('is-visible');

      this.timeout = setTimeout(() => {
        this.el.classList.remove('is-visible');
      }, 3200);
    }
  };

  /* ── 8. SEARCH TOGGLE (mobile) ──────────────────────────── */
  const SearchToggle = {
    init() {
      const btn    = document.querySelector('.frescia-nav__search-toggle');
      const search = document.querySelector('.frescia-nav__search');
      if (!btn || !search) return;

      btn.addEventListener('click', () => {
        search.classList.toggle('is-mobile-open');
        if (search.classList.contains('is-mobile-open')) {
          search.querySelector('input')?.focus();
        }
      });
    }
  };

  /* ── 9. SMOOTH SCROLL for anchor links ──────────────────── */
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
          const target = document.querySelector(a.getAttribute('href'));
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }
  };

  /* ── 10. LAZY IMAGE FALLBACK ────────────────────────────── */
  const LazyImages = {
    init() {
      if (!('IntersectionObserver' in window)) return;
      const imgs = document.querySelectorAll('img[data-src]');
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
      imgs.forEach(img => obs.observe(img));
    }
  };

  /* ── 11. SCROLL REVEAL ──────────────────────────────────── */
  const ScrollReveal = {
    init() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('reveal--visible'));
        return;
      }

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal--visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }
  };

  /* ── 12. ABOUT PAGE — data-animate observer ─────────────── */
  const AboutAnimations = {
    init() {
      const els = document.querySelectorAll('[data-animate]');
      if (!els.length) return;

      if (!('IntersectionObserver' in window)) {
        els.forEach(el => {
          el.style.opacity = '1';
          el.classList.add('is-visible');
        });
        return;
      }

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el    = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => {
            el.style.animationDelay = '0ms';
            el.classList.add('is-visible');
          }, delay);
          obs.unobserve(el);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

      els.forEach(el => obs.observe(el));
    }
  };

  /* ── 13. COUNTER ANIMATION ───────────────────────────────── */
  const CounterAnimation = {
    easeOut(t) { return 1 - Math.pow(1 - t, 3); },

    animateCount(el) {
      const target   = parseInt(el.dataset.count, 10);
      const duration = target > 999 ? 2000 : 1200;
      const start    = performance.now();

      const tick = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value    = Math.round(this.easeOut(progress) * target);

        el.textContent = value >= 1000
          ? value.toLocaleString('ro-RO')
          : value;

        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },

    init() {
      const counters = document.querySelectorAll('[data-count]');
      if (!counters.length) return;

      if (!('IntersectionObserver' in window)) {
        counters.forEach(el => { el.textContent = parseInt(el.dataset.count, 10).toLocaleString('ro-RO'); });
        return;
      }

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          this.animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });

      counters.forEach(el => obs.observe(el));
    }
  };

  /* ── INIT ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    StickyNav.init();
    MobileMenu.init();
    SidebarAccordion.init();
    HeroVideo.init();
    AjaxCart.init();
    CartBadge.init();
    SearchToggle.init();
    SmoothScroll.init();
    LazyImages.init();
    ScrollReveal.init();
    AboutAnimations.init();
    CounterAnimation.init();
  });

})();
