(function () {
  'use strict';

  // Header con sombra al hacer scroll
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');
  var menuLabel = menuToggle ? menuToggle.querySelector('.menu-toggle__label') : null;

  function setMenuState(isOpen) {
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    if (menuLabel) menuLabel.textContent = isOpen ? 'Cerrar' : 'Menú';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    setMenuState(false);
  }

  function toggleMenu() {
    var isOpen = mobileNav.classList.toggle('is-open');
    setMenuState(isOpen);
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', toggleMenu);
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // Acordeón de preguntas frecuentes
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Año dinámico en el footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============ CARRUSEL GENÉRICO ============
  function initCarousel(root) {
    var viewport = root.querySelector('.carousel__viewport');
    var track = root.querySelector('.carousel__track');
    if (!viewport || !track) return;

    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    var prevBtn = root.querySelector('.carousel__arrow--prev');
    var nextBtn = root.querySelector('.carousel__arrow--next');

    var externalSelector = root.getAttribute('data-indicators');
    var usesExternal = !!externalSelector;
    var dotsContainer = usesExternal ? document.querySelector(externalSelector) : root.querySelector('.carousel__dots');
    var dots = [];

    if (slides.length <= 1) {
      var controls = root.querySelector('.carousel__controls');
      if (controls) controls.style.display = 'none';
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (dotsContainer && !usesExternal) dotsContainer.style.display = 'none';
      return;
    }

    // Los indicadores externos (p. ej. los marcadores numerados de "Cómo
    // trabajo") representan cada diapositiva 1:1. Los puntos generados
    // automáticamente representan "páginas" completas de tarjetas, para
    // que la navegación avance por módulos enteros.
    function getGap() {
      var g = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return isNaN(g) ? 0 : g;
    }

    function getVisibleCount() {
      var slideWidth = slides[0].getBoundingClientRect().width;
      if (!slideWidth) return 1;
      var gap = getGap();
      var vw = viewport.clientWidth;
      return Math.max(1, Math.round((vw + gap) / (slideWidth + gap)));
    }

    function getPageCount() {
      return Math.max(1, Math.ceil(slides.length / getVisibleCount()));
    }

    function goToSlide(i) {
      i = Math.max(0, Math.min(i, slides.length - 1));
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }

    function goToPage(p) {
      goToSlide(Math.min(p * getVisibleCount(), slides.length - 1));
    }

    function currentSlideIndex() {
      var left = viewport.scrollLeft;
      var closest = 0;
      var min = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft - left);
        if (d < min) { min = d; closest = i; }
      });
      return closest;
    }

    function currentPage() {
      return Math.floor(currentSlideIndex() / getVisibleCount());
    }

    function buildDots() {
      if (usesExternal) {
        dots = Array.prototype.slice.call(dotsContainer.children);
        return;
      }
      if (!dotsContainer) { dots = []; return; }
      var pages = getPageCount();
      dotsContainer.innerHTML = '';
      dots = [];
      for (var i = 0; i < pages; i++) {
        (function (pageIndex) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'carousel__dot';
          b.setAttribute('aria-label', 'Ir al grupo ' + (pageIndex + 1));
          b.addEventListener('click', function () { goToPage(pageIndex); });
          dotsContainer.appendChild(b);
          dots.push(b);
        })(i);
      }
    }

    if (usesExternal) {
      dots = Array.prototype.slice.call(dotsContainer.children);
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { goToSlide(i); });
      });
    } else {
      buildDots();
    }

    function updateActive() {
      var slideIdx = currentSlideIndex();
      var activeIdx = usesExternal ? slideIdx : currentPage();
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === activeIdx);
      });
      if (prevBtn) prevBtn.disabled = slideIdx === 0;
      if (nextBtn) nextBtn.disabled = slideIdx >= slides.length - 1;
      root.dispatchEvent(new CustomEvent('carousel:update', { detail: { index: slideIdx } }));
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentSlideIndex() - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentSlideIndex() + 1); });

    var ticking = false;
    viewport.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!usesExternal) buildDots();
        updateActive();
      }, 200);
    });

    updateActive();
  }

  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  // Barra de progreso de "Cómo trabajo"
  var stepsCarousel = document.getElementById('stepsCarousel');
  var stepsFill = document.getElementById('stepsFill');
  if (stepsCarousel && stepsFill) {
    var stepsViewport = stepsCarousel.querySelector('.carousel__viewport');
    function updateStepsProgress() {
      var max = stepsViewport.scrollWidth - stepsViewport.clientWidth;
      var pct = max > 0 ? (stepsViewport.scrollLeft / max) * 100 : 0;
      stepsFill.style.width = pct + '%';
    }
    stepsViewport.addEventListener('scroll', updateStepsProgress, { passive: true });
    updateStepsProgress();
  }

  // Resaltar el enlace de navegación de la sección visible (scrollspy)
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var sectionMap = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      var section = document.getElementById(id);
      if (section) sectionMap[id] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = sectionMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Object.keys(sectionMap).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }
})();
