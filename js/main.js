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

  function closeMenu() {
    menuToggle.classList.remove('is-active');
    mobileNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    var isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
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

    var dots = [];
    var dotsContainer = null;
    var externalSelector = root.getAttribute('data-indicators');

    if (externalSelector) {
      dotsContainer = document.querySelector(externalSelector);
    } else {
      dotsContainer = root.querySelector('.carousel__dots');
    }

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (dotsContainer && !externalSelector) dotsContainer.style.display = 'none';
      return;
    }

    if (dotsContainer) {
      if (externalSelector) {
        dots = Array.prototype.slice.call(dotsContainer.children);
      } else {
        dotsContainer.innerHTML = '';
        slides.forEach(function (_, i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'carousel__dot';
          b.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
          dotsContainer.appendChild(b);
          dots.push(b);
        });
      }
    }

    function goTo(i) {
      i = Math.max(0, Math.min(i, slides.length - 1));
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }

    function currentIndex() {
      var left = viewport.scrollLeft;
      var closest = 0;
      var min = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft - left);
        if (d < min) { min = d; closest = i; }
      });
      return closest;
    }

    function updateActive() {
      var idx = currentIndex();
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === idx);
      });
      if (prevBtn) prevBtn.disabled = idx === 0;
      if (nextBtn) nextBtn.disabled = idx === slides.length - 1;
      root.dispatchEvent(new CustomEvent('carousel:update', { detail: { index: idx } }));
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentIndex() - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentIndex() + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

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
