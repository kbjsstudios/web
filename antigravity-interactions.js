/* ============================================================
   ANTIGRAVITY PREMIUM INTERACTIONS
   ------------------------------------------------------------
   Advanced JavaScript for magnetic buttons, smooth scroll,
   parallax effects, cursor interactions, and gesture animations.
   ============================================================ */

(function () {
  'use strict';

  var doc = document;
  var win = window;
  var body = doc.body;

  // Utility functions
  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(sel));
  }

  // Check if reduced motion is preferred
  var prefersReducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     01 ENHANCED CURSOR
     ============================================================ */
  (function initCursor() {
    if (prefersReducedMotion) return;

    var dot = doc.createElement('div');
    dot.className = 'custom-cursor-dot';
    var ring = doc.createElement('div');
    ring.className = 'custom-cursor-ring';

    body.appendChild(dot);
    body.appendChild(ring);

    var mouse = { x: 0, y: 0 };
    var dotPos = { x: 0, y: 0 };
    var ringPos = { x: 0, y: 0 };

    // Update mouse position
    doc.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Smooth cursor follow with different speeds
    function updateCursor() {
      // Dot follows closely (fast)
      dotPos.x += (mouse.x - dotPos.x) * 0.5;
      dotPos.y += (mouse.y - dotPos.y) * 0.5;

      // Ring follows with lag (slower)
      ringPos.x += (mouse.x - ringPos.x) * 0.15;
      ringPos.y += (mouse.y - ringPos.y) * 0.15;

      dot.style.transform = 'translate(' + dotPos.x + 'px, ' + dotPos.y + 'px)';
      ring.style.transform = 'translate(' + ringPos.x + 'px, ' + ringPos.y + 'px)';

      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover states
    var interactiveElements = 'a, button, [role="button"], .service-card, .work-card, input, textarea, select';

    doc.addEventListener('mouseover', function(e) {
      if (e.target.closest(interactiveElements)) {
        body.classList.add('cursor-hover');
      }
    });

    doc.addEventListener('mouseout', function(e) {
      if (e.target.closest(interactiveElements)) {
        body.classList.remove('cursor-hover');
      }
    });

    // Click state
    doc.addEventListener('mousedown', function() {
      body.classList.add('cursor-click');
    });

    doc.addEventListener('mouseup', function() {
      body.classList.remove('cursor-click');
    });

    // Hide cursor when leaving window
    doc.addEventListener('mouseleave', function() {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    doc.addEventListener('mouseenter', function() {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  })();

  /* ============================================================
     02 MAGNETIC BUTTONS
     ============================================================ */
  (function initMagneticButtons() {
    if (prefersReducedMotion) return;

    var magneticElements = $$('.btn, .service-card, .work-card');

    magneticElements.forEach(function(el) {
      var strength = el.classList.contains('btn') ? 0.3 : 0.15;

      el.addEventListener('mousemove', function(e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;

        var moveX = x * strength;
        var moveY = y * strength;

        el.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      });

      el.addEventListener('mouseleave', function() {
        el.style.transform = '';
      });
    });
  })();

  /* ============================================================
     03 SMOOTH SCROLL
     ============================================================ */
  (function initSmoothScroll() {
    if (prefersReducedMotion) return;

    // Smooth scroll for anchor links
    $$('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = $(href);
        if (!target) return;

        e.preventDefault();

        var targetPos = target.getBoundingClientRect().top + win.pageYOffset;
        var startPos = win.pageYOffset;
        var distance = targetPos - startPos - 80; // Offset for fixed header
        var duration = 1000;
        var start = null;

        function animation(currentTime) {
          if (start === null) start = currentTime;
          var timeElapsed = currentTime - start;
          var progress = Math.min(timeElapsed / duration, 1);

          // Easing function (ease-out-expo)
          var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

          win.scrollTo(0, startPos + distance * ease);

          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        }

        requestAnimationFrame(animation);
      });
    });
  })();

  /* ============================================================
     04 SCROLL REVEAL ANIMATIONS
     ============================================================ */
  (function initScrollReveal() {
    if (prefersReducedMotion) {
      // Instantly reveal everything
      $$('.enter, .section-head, .service-card, .work-card, .why-card, .step, .faq-item').forEach(function(el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    $$('.enter, .section-head, .service-card, .work-card, .why-card, .step, .faq-item').forEach(function(el) {
      observer.observe(el);
    });
  })();

  /* ============================================================
     05 PARALLAX SCROLLING
     ============================================================ */
  (function initParallax() {
    if (prefersReducedMotion) return;

    var parallaxElements = $$('[data-parallax]');
    if (!parallaxElements.length) return;

    var ticking = false;

    function updateParallax() {
      var scrolled = win.pageYOffset;

      parallaxElements.forEach(function(el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        var yPos = -(scrolled * speed);
        el.style.transform = 'translate3d(0, ' + yPos + 'px, 0)';
      });

      ticking = false;
    }

    win.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ============================================================
     06 SCROLL PROGRESS BAR
     ============================================================ */
  (function initScrollProgress() {
    var progressBar = doc.createElement('div');
    progressBar.className = 'scroll-progress';
    body.appendChild(progressBar);

    var ticking = false;

    function updateProgress() {
      var scrollHeight = doc.documentElement.scrollHeight - win.innerHeight;
      var scrolled = win.pageYOffset;
      var progress = scrolled / scrollHeight;

      progressBar.style.transform = 'scaleX(' + progress + ')';
      ticking = false;
    }

    win.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ============================================================
     07 3D TILT EFFECT ON CARDS
     ============================================================ */
  (function init3DTilt() {
    if (prefersReducedMotion) return;

    var tiltCards = $$('.work-card, .service-card');

    tiltCards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
        var rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  })();

  /* ============================================================
     08 ENHANCED FORM VALIDATION WITH ANIMATIONS
     ============================================================ */
  (function initFormValidation() {
    var forms = $$('form');

    forms.forEach(function(form) {
      var inputs = $$('input, textarea, select', form);

      inputs.forEach(function(input) {
        // Real-time validation
        input.addEventListener('blur', function() {
          validateField(input);
        });

        // Clear error on focus
        input.addEventListener('focus', function() {
          input.classList.remove('error');
          var errorMsg = input.parentElement.querySelector('.error-message');
          if (errorMsg) errorMsg.remove();
        });
      });

      form.addEventListener('submit', function(e) {
        var isValid = true;

        inputs.forEach(function(input) {
          if (!validateField(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          // Shake the form
          form.classList.add('shake');
          setTimeout(function() {
            form.classList.remove('shake');
          }, 500);
        }
      });
    });

    function validateField(input) {
      var value = input.value.trim();
      var type = input.type;
      var required = input.hasAttribute('required');
      var isValid = true;
      var errorMessage = '';

      // Remove existing error
      var existingError = input.parentElement.querySelector('.error-message');
      if (existingError) existingError.remove();

      if (required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
      } else if (type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      } else if (input.hasAttribute('minlength')) {
        var minLength = parseInt(input.getAttribute('minlength'));
        if (value.length < minLength) {
          isValid = false;
          errorMessage = 'Minimum ' + minLength + ' characters required';
        }
      }

      if (!isValid) {
        input.classList.add('error');
        var error = doc.createElement('span');
        error.className = 'error-message';
        error.textContent = errorMessage;
        error.style.color = '#e11d2e';
        error.style.fontSize = 'var(--fs-xs)';
        error.style.marginTop = 'var(--sp-1)';
        error.style.display = 'block';
        input.parentElement.appendChild(error);
      } else {
        input.classList.remove('error');
      }

      return isValid;
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  })();

  /* ============================================================
     09 LOADING STATES FOR ASYNC ACTIONS
     ============================================================ */
  (function initLoadingStates() {
    // Add loading state to buttons on form submit
    $$('form').forEach(function(form) {
      form.addEventListener('submit', function() {
        var submitBtn = $('button[type="submit"]', form);
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.classList.add('loading');
          submitBtn.disabled = true;

          var originalText = submitBtn.textContent;
          submitBtn.innerHTML = '<span class="spinner">⟳</span> ' + originalText;

          // Re-enable after 5 seconds (failsafe)
          setTimeout(function() {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }, 5000);
        }
      });
    });
  })();

  /* ============================================================
     10 INTERSECTION OBSERVER FOR PERFORMANCE
     ============================================================ */
  (function initLazyEffects() {
    // Only animate elements when they're near viewport
    var heavyElements = $$('.hero-canvas, [data-heavy]');

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, {
      rootMargin: '200px'
    });

    heavyElements.forEach(function(el) {
      observer.observe(el);
    });
  })();

  /* ============================================================
     11 ENHANCED TAB ANIMATIONS
     ============================================================ */
  (function enhanceTabAnimations() {
    if (prefersReducedMotion) return;

    var tabLists = $$('[role="tablist"]');

    tabLists.forEach(function(tabList) {
      var tabs = $$('[role="tab"]', tabList);
      var panels = tabs.map(function(tab) {
        var panelId = tab.getAttribute('aria-controls');
        return $('#' + panelId);
      }).filter(Boolean);

      tabs.forEach(function(tab, index) {
        tab.addEventListener('click', function() {
          // Add slide direction class
          panels.forEach(function(panel, panelIndex) {
            if (panel.classList.contains('open')) {
              var direction = panelIndex < index ? 'slide-left' : 'slide-right';
              panel.classList.add(direction);

              setTimeout(function() {
                panel.classList.remove(direction);
              }, 300);
            }
          });
        });
      });
    });
  })();

  /* ============================================================
     12 PERFORMANCE MONITORING
     ============================================================ */
  (function initPerformanceMonitoring() {
    // Only in development
    if (win.location.hostname === 'localhost' || win.location.hostname === '127.0.0.1') {
      // Monitor FPS
      var lastTime = performance.now();
      var frames = 0;
      var fps = 60;

      function measureFPS() {
        frames++;
        var currentTime = performance.now();

        if (currentTime >= lastTime + 1000) {
          fps = Math.round((frames * 1000) / (currentTime - lastTime));
          frames = 0;
          lastTime = currentTime;

          if (fps < 30) {
            console.warn('Low FPS detected:', fps);
          }
        }

        requestAnimationFrame(measureFPS);
      }

      requestAnimationFrame(measureFPS);
    }
  })();

  /* ============================================================
     13 KEYBOARD NAVIGATION ENHANCEMENTS
     ============================================================ */
  (function enhanceKeyboardNav() {
    // Add visible focus indicator
    var focusableElements = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

    doc.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        body.classList.add('keyboard-nav');
      }
    });

    doc.addEventListener('mousedown', function() {
      body.classList.remove('keyboard-nav');
    });

    // Escape key closes modals
    doc.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        $$('.modal.open, .lb-modal.open, .nav-drawer.open').forEach(function(modal) {
          modal.classList.remove('open');
          body.style.overflow = '';
        });
      }
    });
  })();

  /* ============================================================
     14 TOUCH GESTURES FOR MOBILE
     ============================================================ */
  (function initTouchGestures() {
    var touchStartX = 0;
    var touchStartY = 0;

    doc.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    doc.addEventListener('touchend', function(e) {
      var touchEndX = e.changedTouches[0].clientX;
      var touchEndY = e.changedTouches[0].clientY;

      var deltaX = touchEndX - touchStartX;
      var deltaY = touchEndY - touchStartY;

      // Swipe detection (minimum 50px)
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          // Swipe right - close drawer
          var drawer = $('.nav-drawer.open');
          if (drawer) {
            drawer.classList.remove('open');
            body.style.overflow = '';
          }
        }
      }
    }, { passive: true });
  })();

  /* ============================================================
     15 VIEWPORT HEIGHT FIX FOR MOBILE
     ============================================================ */
  (function fixViewportHeight() {
    function setVH() {
      var vh = win.innerHeight * 0.01;
      doc.documentElement.style.setProperty('--vh', vh + 'px');
    }

    setVH();
    win.addEventListener('resize', setVH);
    win.addEventListener('orientationchange', setVH);
  })();

  /* ============================================================
     16 PREFETCH LINKS ON HOVER
     ============================================================ */
  (function initLinkPrefetch() {
    var prefetched = {};

    $$('a[href^="/"], a[href^="./"]').forEach(function(link) {
      link.addEventListener('mouseenter', function() {
        var href = this.href;

        if (prefetched[href]) return;
        prefetched[href] = true;

        var prefetchLink = doc.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        doc.head.appendChild(prefetchLink);
      }, { once: true });
    });
  })();

  /* ============================================================
     17 CONSOLE EASTER EGG
     ============================================================ */
  (function initEasterEgg() {
    if (win.console && console.log) {
      var styles = [
        'font-size: 20px',
        'font-weight: bold',
        'background: linear-gradient(120deg, #2e7cf6, #7c5cff, #f45ca6)',
        'color: white',
        'padding: 10px 20px',
        'border-radius: 8px'
      ].join(';');

      console.log('%c👋 Hey there!', styles);
      console.log('%cLooking for something? Check out our GitHub or get in touch!', 'font-size: 14px; color: #5f6368;');
      console.log('%cKBJS Studios - Built with ❤️', 'font-size: 12px; color: #8a8f9c;');
    }
  })();

  /* ============================================================
     18 CLEANUP ON PAGE UNLOAD
     ============================================================ */
  win.addEventListener('pagehide', function() {
    // Clean up any running animations or intervals
    // This helps prevent memory leaks
  });

  console.log('[KBJS Antigravity] Enhanced interactions loaded ✨');
})();
