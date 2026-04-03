/* ============================================================
   DE CHANGENCY, MAIN JAVASCRIPT (main.js)
   Sticky header, mobile menu, scroll fade-in animaties.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================================
     TESTIMONIALS CAROUSEL (scroll-snap + pijlen + dots)
     ================================================================ */
  const testimonialCarousel = document.querySelector('[data-testimonials-carousel]');
  if (testimonialCarousel) {
    let liveRegion = testimonialCarousel.querySelector('[data-carousel-live]');
    if (!liveRegion) {
      liveRegion = document.createElement('p');
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('data-carousel-live', '');
      testimonialCarousel.appendChild(liveRegion);
    }

    const viewport = testimonialCarousel.querySelector('[data-carousel-viewport]');
    const track = testimonialCarousel.querySelector('[data-carousel-track]');
    const slides = track ? Array.from(track.querySelectorAll('blockquote')) : [];
    const btnPrev = testimonialCarousel.querySelector('[data-carousel-prev]');
    const btnNext = testimonialCarousel.querySelector('[data-carousel-next]');
    const dotsRoot = testimonialCarousel.querySelector('[data-carousel-dots]');
    const mqTwoCol = window.matchMedia('(min-width: 769px)');
    let lastAnnouncedIndex = -1;

    const getGapPx = () => {
      if (!track || !slides.length) return 0;
      const styles = getComputedStyle(track);
      const g = styles.columnGap || styles.gap || '0';
      return parseFloat(g) || 0;
    };

    const layoutSlides = () => {
      if (!viewport || !slides.length) return;
      const inner = viewport.clientWidth;
      if (inner < 1) return;
      const gap = getGapPx();
      const twoCol = mqTwoCol.matches;
      const slideW = twoCol ? (inner - gap) / 2 : inner;
      slides.forEach((slide) => {
        slide.style.flex = `0 0 ${slideW}px`;
        slide.style.width = `${slideW}px`;
        slide.style.minWidth = `${slideW}px`;
      });
    };

    const getScrollLeftForIndex = (index) => {
      const gap = getGapPx();
      let left = 0;
      for (let j = 0; j < index; j++) {
        left += slides[j].offsetWidth + gap;
      }
      return left;
    };

    const getActiveIndex = () => {
      if (!viewport || !slides.length) return 0;
      const sl = viewport.scrollLeft;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((_, idx) => {
        const target = getScrollLeftForIndex(idx);
        const d = Math.abs(sl - target);
        if (d < bestDist) {
          bestDist = d;
          best = idx;
        }
      });
      return best;
    };

    const maxScrollLeft = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);

    const goTo = (index) => {
      if (!viewport || !slides.length) return;
      const n = slides.length;
      const i = ((index % n) + n) % n;
      let targetLeft = getScrollLeftForIndex(i);
      const max = maxScrollLeft();
      /* Op desktop (2 kolommen) past de laatste slide niet als snap-start; clamp naar max. */
      targetLeft = Math.min(targetLeft, max);
      viewport.scrollTo({
        left: targetLeft,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    };

    const goToNext = () => {
      if (!viewport || !slides.length) return;
      const i = getActiveIndex();
      const max = maxScrollLeft();
      const nextIdx = (i + 1) % slides.length;
      const nextLeft = getScrollLeftForIndex(nextIdx);
      /* Einde bereikt: volgende slide-start > max (2-kolom) of expliciet wrap naar eerste. */
      if (nextIdx === 0 || nextLeft > max + 0.5) {
        goTo(0);
        return;
      }
      goTo(nextIdx);
    };

    const goToPrev = () => {
      if (!viewport || !slides.length) return;
      const i = getActiveIndex();
      const max = maxScrollLeft();
      if (i === 0) {
        viewport.scrollTo({
          left: max,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        return;
      }
      goTo(i - 1);
    };

    const syncNav = () => {
      if (!viewport) return;
      const i = getActiveIndex();
      const max = maxScrollLeft();
      const canScroll = max > 3;
      const multi = slides.length > 1;

      if (dotsRoot) {
        dotsRoot.querySelectorAll('button').forEach((btn, idx) => {
          const on = idx === i;
          btn.classList.toggle('is-active', on);
          if (on) btn.setAttribute('aria-current', 'true');
          else btn.removeAttribute('aria-current');
        });
      }

      if (liveRegion && slides.length) {
        if (i !== lastAnnouncedIndex) {
          lastAnnouncedIndex = i;
          liveRegion.textContent = `Recensie ${i + 1} van ${slides.length}`;
        }
      }
      if (btnPrev) {
        btnPrev.disabled = !multi || !canScroll;
      }
      if (btnNext) {
        btnNext.disabled = !multi || !canScroll;
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const attachTouchWrap = () => {
      if (!viewport || slides.length < 2) return;
      viewport.addEventListener(
        'touchstart',
        (e) => {
          if (!e.touches[0]) return;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        },
        { passive: true }
      );
      viewport.addEventListener(
        'touchend',
        (e) => {
          if (!e.changedTouches[0]) return;
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          const deltaX = endX - touchStartX;
          const deltaY = endY - touchStartY;
          if (Math.abs(deltaY) > Math.abs(deltaX)) return;

          const idx = getActiveIndex();
          const max = maxScrollLeft();
          const sl = viewport.scrollLeft;
          const threshold = 45;

          if (deltaX < -threshold && idx === slides.length - 1 && sl >= max - 12) {
            goTo(0);
            return;
          }
          if (deltaX > threshold && idx === 0 && sl <= 12) {
            goTo(slides.length - 1);
          }
        },
        { passive: true }
      );
    };

    let scrollEndTimer;
    const onScroll = () => {
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(syncNav, 50);
    };

    const refreshLayout = () => {
      layoutSlides();
      syncNav();
    };

    layoutSlides();
    window.requestAnimationFrame(() => {
      layoutSlides();
      if (dotsRoot && slides.length) {
        dotsRoot.innerHTML = '';
        slides.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'testimonials-carousel__dot';
          dot.setAttribute('aria-label', `Ga naar recensie ${idx + 1} van ${slides.length}`);
          dot.addEventListener('click', () => goTo(idx));
          dotsRoot.appendChild(dot);
        });
      }
      syncNav();
      attachTouchWrap();
    });

    if (viewport) {
      viewport.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => {
        window.requestAnimationFrame(refreshLayout);
      });
      if (typeof mqTwoCol.addEventListener === 'function') {
        mqTwoCol.addEventListener('change', refreshLayout);
      } else {
        mqTwoCol.addListener(refreshLayout);
      }
      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(() => refreshLayout());
        ro.observe(viewport);
      }
    }

    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            refreshLayout();
          }
        });
      }, { rootMargin: '80px', threshold: 0 });
      io.observe(testimonialsSection);
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        goToPrev();
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        goToNext();
      });
    }

    const focusTarget = viewport || testimonialCarousel;
    focusTarget.setAttribute('tabindex', '0');
    focusTarget.setAttribute('role', 'region');
    focusTarget.setAttribute('aria-label', 'Recensies van opdrachtgevers, gebruik pijltoetsen om te bladeren');

    focusTarget.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    });
  }

  /* ================================================================
     STICKY HEADER, schaduw bij scroll (rAF voor minder layout-work)
     ================================================================ */
  const header = document.querySelector('header');

  if (header) {
    let scrollTicking = false;
    const updateHeader = () => {
      scrollTicking = false;
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    const onScroll = () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateHeader);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeader();
  }


  /* ================================================================
     MOBILE HAMBURGER MENU
     ================================================================ */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  const setMenuOpen = (open) => {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  };

  if (hamburger && mobileNav) {
    hamburger.setAttribute('aria-expanded', 'false');
    const controlsId = mobileNav.id || 'site-nav-mobile';
    if (!mobileNav.id) mobileNav.id = controlsId;
    hamburger.setAttribute('aria-controls', controlsId);

    hamburger.addEventListener('click', () => {
      setMenuOpen(!mobileNav.classList.contains('open'));
    });

    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', () => setMenuOpen(false));
    }

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        setMenuOpen(false);
      }
    });
  }


  /* ================================================================
     SCROLL FADE-IN ANIMATIES (IntersectionObserver)
     Secties (behalve de eerste) faden zachtjes in bij scrollen.
     Bij prefers-reduced-motion: geen verbergen / geen animatie.
     ================================================================ */
  if (prefersReducedMotion) {
    return;
  }

  const sections = document.querySelectorAll('main section');

  if (sections.length > 1 && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-scroll-animations');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '50px'
    });

    sections.forEach((section, index) => {
      if (index === 0) return;
      section.classList.add('section-animate');
      observer.observe(section);
    });

    // Fallback: maak alles zichtbaar als observer niet triggert (tab in achtergrond, edge cases)
    setTimeout(() => {
      document.querySelectorAll('.section-animate:not(.section-visible)').forEach(el => {
        el.classList.add('section-visible');
      });
    }, 2000);
  }

});
