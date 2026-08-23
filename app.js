/* KBJS Studios — App Shell with Visual Effects */

(function () {
  'use strict';

  // ─── DARK THEME DEFAULT (respects system preference on first visit) ───
  var saved = localStorage.getItem('kbjs_theme');
  var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  if (saved === 'light' || (!saved && prefersLight)) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.add('dark-theme');
  }

  // ─── PARTICLES ───
  (function () {
    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];
    var NUM = 40;
    var COLORS = ['#635bff', '#38bdf8', '#ff5c8a', '#8b7cff'];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Draw connections
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(99,91,255,' + (0.028 * (1 - dist / 110)) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ─── TERMINAL CONSOLE ───
  (function () {
    var body = document.getElementById('console-body');
    if (!body) return;

    var lines = [
      { prompt: '$ ', text: 'kbjs --version',        output: 'KBJS Studios v1.0.0',             outColor: '#38bdf8' },
      { prompt: '$ ', text: 'kbjs services --list',   output: '<a href="thumbnails.html" style="color:var(--primary);text-decoration:none;">Thumbnails</a> \u00B7 <a href="discord.html" style="color:var(--primary);text-decoration:none;">Discord</a> \u00B7 <a href="minecraft.html" style="color:var(--primary);text-decoration:none;">Minecraft</a> \u00B7 <a href="video.html" style="color:var(--primary);text-decoration:none;">Video</a>', outColor: null, isHTML: true },
      { prompt: '$ ', text: 'kbjs status',            output: '\u2713 Available for new projects',   outColor: '#10b981' },
      { prompt: '$ ', text: 'exit',                   output: '',                              outColor: null },
    ];

    var li = 0;

    function typeText(el, text, cb) {
      var i = 0;
      var iv = setInterval(function () {
        el.textContent += text[i++];
        if (i >= text.length) { clearInterval(iv); if (cb) cb(); }
      }, 40);
    }

    function addLine() {
      if (li >= lines.length) { li = 0; setTimeout(clearAndRestart, 3000); return; }
      var data = lines[li++];

      var row = document.createElement('div');
      row.className = 'console-line';
      row.style.opacity = '0';
      row.style.transition = 'opacity 0.3s';

      var promptEl = document.createElement('span');
      promptEl.className = 'console-prompt';
      promptEl.textContent = data.prompt;

      var cmdEl = document.createElement('span');
      cmdEl.className = 'console-output';

      row.appendChild(promptEl);
      row.appendChild(cmdEl);
      body.appendChild(row);
      requestAnimationFrame(function () { row.style.opacity = '1'; });

      typeText(cmdEl, data.text, function () {
        setTimeout(function () {
          if (data.output) {
            var outRow = document.createElement('div');
            outRow.style.cssText = 'opacity:0; transition:opacity 0.3s; padding-left:16px; font-size:0.85rem;';
            outRow.style.color = data.outColor || 'var(--text-muted)';
            if (data.isHTML) {
              outRow.innerHTML = data.output;
            } else {
              outRow.textContent = data.output;
            }
            body.appendChild(outRow);
            requestAnimationFrame(function () { outRow.style.opacity = '1'; });
          }
          body.scrollTop = body.scrollHeight;
          setTimeout(addLine, 700);
        }, 300);
      });

      body.scrollTop = body.scrollHeight;
    }

    function clearAndRestart() {
      while (body.firstChild) body.removeChild(body.firstChild);
      addLine();
    }

    setTimeout(addLine, 600);
  })();

  // ─── MOBILE MENU ───
  var toggle = document.getElementById('mobile-toggle');
  var navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('mobile-active');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('mobile-active');
      });
    });
  }

  // ─── HEADER SCROLL ───
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ─── THEME TOGGLE ───
  (function () {
    var btns = document.querySelectorAll('.theme-toggle-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        var isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('kbjs_theme', isDark ? 'dark' : 'light');
        showToast('Switched to ' + (isDark ? 'Dark' : 'Light') + ' Mode');
      });
    });
  })();

  // ─── CUSTOM CURSOR ───
  (function () {

    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    var dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var curX = 0, curY = 0;
    var ringX = 0, ringY = 0;
    var active = false;

    window.addEventListener('mousemove', function (e) {
      curX = e.clientX;
      curY = e.clientY;
      if (!active) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        ringX = curX;
        ringY = curY;
        active = true;
      }
    });

    window.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      active = false;
    });

    function update() {
      if (active) {
        ringX += (curX - ringX) * 0.15;
        ringY += (curY - ringY) * 0.15;
        dot.style.left = curX + 'px';
        dot.style.top = curY + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
      }
      requestAnimationFrame(update);
    }
    update();

    var targets = 'a, button, select, input[type="checkbox"], .service-card, .tier-card, .addon-item, .faq-question, .channel-card, .gallery-item, .yt-video-item, .download-card, .profile-btn, .social-icon-btn, .category-tab, .creator-tab, .split-block, .contact-card, .glass-panel, .slider-input, .lb-nav, .lb-x, .lb-btn, .back-to-top';

    document.addEventListener('mouseover', function (e) {
      var hit = e.target && e.target.closest && e.target.closest(targets);
      document.body.classList.toggle('cursor-hover', !!hit);
    });
    document.addEventListener('mousedown', function () {
      document.body.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', function () {
      document.body.classList.remove('cursor-click');
    });
  })();

  // ─── STATS WIDGET (Universal Views & Likes) ───
  (function () {
    var config = window.FIREBASE_CONFIG;
    var useFirebase = config && config.databaseURL;

    var statsKey = 'kbjs_stats';
    var likedKey = 'kbjs_liked';
    var viewedKey = 'kbjs_viewed';

    var state = {
      views: 0,
      likes: 0,
      liked: localStorage.getItem(likedKey) === 'true'
    };

    var HEART_ON = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
    var HEART_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';

    // ── Build Widget ──
    var widget = document.createElement('div');
    widget.className = 'stats-widget';

    // Live dot
    var dot = document.createElement('span');
    dot.className = 'stats-dot';
    widget.appendChild(dot);

    // Views
    var viewsItem = document.createElement('span');
    viewsItem.className = 'stat-item';
    viewsItem.innerHTML = '<span class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></span><span class="stat-count" id="stats-views">0</span>';
    widget.appendChild(viewsItem);

    var sep = document.createElement('span');
    sep.className = 'stat-sep';
    sep.textContent = '\u00B7';
    widget.appendChild(sep);

    // Like button
    var likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn-stats' + (state.liked ? ' liked' : '');
    likeBtn.innerHTML = '<span class="heart-icon">' + (state.liked ? HEART_ON : HEART_OFF) + '</span><span class="stat-count" id="stats-likes">0</span>';
    widget.appendChild(likeBtn);

    document.body.appendChild(widget);

    var viewsEl = document.getElementById('stats-views');
    var likesEl = document.getElementById('stats-likes');

    function updateUI() {
      if (viewsEl) viewsEl.textContent = state.views;
      if (likesEl) likesEl.textContent = state.likes;
    }

    // ── Firebase Sync ──
    if (useFirebase) {
      // Load Firebase SDK dynamically (async=false preserves execution order)
      var script = document.createElement('script');
      script.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
      script.async = false;
      document.head.appendChild(script);

      var dbScript = document.createElement('script');
      dbScript.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js';
      dbScript.async = false;
      document.head.appendChild(dbScript);

      dbScript.onload = function () {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
        var db = firebase.database();
        var statsRef = db.ref('stats');

        // Listen for real-time updates
        statsRef.on('value', function (snapshot) {
          var data = snapshot.val() || {};
          state.views = data.views || 0;
          state.likes = data.likes || 0;
          updateUI();
        });

        // Track view (once per session)
        if (!sessionStorage.getItem(viewedKey)) {
          sessionStorage.setItem(viewedKey, '1');
          statsRef.child('views').transaction(function (current) {
            return (current || 0) + 1;
          });
        }

        // Handle like
        likeBtn.addEventListener('click', function () {
          if (state.liked) return;
          state.liked = true;
          localStorage.setItem(likedKey, 'true');
          likeBtn.classList.add('liked');
          likeBtn.querySelector('.heart-icon').innerHTML = HEART_ON;
          statsRef.child('likes').transaction(function (current) {
            return (current || 0) + 1;
          });
        });
      };
    } else {
      // ── localStorage fallback (per-device) ──
      var stored = JSON.parse(localStorage.getItem(statsKey) || '{"views":0,"likes":0}');
      state.views = stored.views;
      state.likes = stored.likes;
      updateUI();

      if (!sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, '1');
        state.views++;
        stored.views = state.views;
        localStorage.setItem(statsKey, JSON.stringify(stored));
        updateUI();
      }

      likeBtn.addEventListener('click', function () {
        if (state.liked) return;
        state.liked = true;
        localStorage.setItem(likedKey, 'true');
        likeBtn.classList.add('liked');
        likeBtn.querySelector('.heart-icon').innerHTML = HEART_ON;
        state.likes++;
        stored.likes = state.likes;
        localStorage.setItem(statsKey, JSON.stringify(stored));
        updateUI();
      });
    }
  })();

  // ─── FAQ ACCORDION ───
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isActive = item.classList.contains('active');
      faqItems.forEach(function (other) {
        other.classList.remove('active');
        var otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = '0px';
      });
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ─── TOAST UTILITY ───
  window.showToast = function (message, type) {
    type = type || 'success';
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<span>' + (type === 'success' ? '\u2713' : '\u2715') + '</span> ' + message;
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  };

  // ─── MORE SIDEBAR ───
  (function () {
    var toggle = document.getElementById('more-sidebar-toggle');
    var overlay = document.getElementById('more-sidebar-overlay');
    var sidebar = document.getElementById('more-sidebar');
    var close = document.getElementById('more-sidebar-close');
    if (!toggle || !overlay || !sidebar || !close) return;
    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    toggle.addEventListener('click', function (e) { e.stopPropagation(); openSidebar(); });
    close.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSidebar(); });
  })();

  // ─── COOKIE CONSENT ───
  (function () {
    if (localStorage.getItem('kbjs_cookie_consent')) return;
    var banner = document.createElement('div');
    banner.className = 'cookie-consent show';
    banner.innerHTML =
      '<div class="cookie-consent-inner">' +
        '<p>We use cookies to improve your experience. Read our <a href="privacy.html">Privacy Policy</a>.</p>' +
        '<div class="cookie-buttons">' +
          '<button class="cookie-btn cookie-btn-decline" id="cookie-decline">Decline</button>' +
          '<button class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      localStorage.setItem('kbjs_cookie_consent', 'accepted');
      banner.remove();
    });
    document.getElementById('cookie-decline').addEventListener('click', function () {
      localStorage.setItem('kbjs_cookie_consent', 'declined');
      banner.remove();
    });
  })();

  // ─── CONTACT FORM ───
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('contact-name');
      var email = document.getElementById('contact-email');
      var message = document.getElementById('contact-message');
      if (!name || !email || !message) return;
      if (!name.value || !email.value || !message.value) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      var inquiry = {
        date: new Date().toISOString(),
        name: name.value,
        email: email.value,
        message: message.value
      };

      // Keep a local backup copy (message truncated for storage hygiene)
      var inquiries = JSON.parse(localStorage.getItem('kbjs_inquiries') || '[]');
      inquiries.push({
        date: inquiry.date,
        name: inquiry.name,
        email: inquiry.email,
        message: inquiry.message.substring(0, 50) + '...'
      });
      localStorage.setItem('kbjs_inquiries', JSON.stringify(inquiries));

      // Deliver via Discord webhook when configured
      var hook = window.CONTACT_WEBHOOK_URL;
      if (hook) {
        fetch(hook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'KBJS Studios — Contact Form',
            embeds: [{
              title: 'New Inquiry',
              color: 0xcfa968,
              fields: [
                { name: 'Name', value: inquiry.name.substring(0, 256), inline: true },
                { name: 'Email', value: inquiry.email.substring(0, 256), inline: true },
                { name: 'Message', value: inquiry.message.substring(0, 1024) || '—' }
              ],
              timestamp: inquiry.date
            }]
          })
        }).then(function () {
          showToast('Message sent! We will get back to you within 24 hours.');
          contactForm.reset();
        }).catch(function () {
          showToast('Could not send right now — please try again.', 'error');
        });
      } else {
        showToast('Message sent! We will get back to you within 24 hours.');
        contactForm.reset();
      }
    });
  }

  // ─── SCROLL REVEAL ───
  (function () {
    var els = document.querySelectorAll(
      '.service-card, .why-card, .testimonial-card, .faq-item, .section-header, .channel-card, .split-block, .contact-card, .gallery-item'
    );
    if (els.length === 0) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    els.forEach(function (el, idx) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transitionDelay = (idx % 4) * 80 + 'ms';
      observer.observe(el);
    });
  })();

  // ─── THUMBNAIL CATEGORY TABS ───
  (function () {
    var tabs = document.querySelectorAll('.category-tab');
    var items = document.querySelectorAll('.gallery-item');
    var viewMore = document.getElementById('view-more-btn');
    var INITIAL_LIMIT = 3;
    var showingAll = false;

    function show() {
      var visible = [];
      var cat = document.querySelector('.category-tab.active');
      if (!cat) return;
      cat = cat.dataset.category;
      for (var j = 0; j < items.length; j++) {
        if (cat === 'all' || items[j].dataset.category === cat) {
          items[j].classList.remove('hidden');
          visible.push(items[j]);
        } else {
          items[j].classList.add('hidden');
        }
      }
      if (!viewMore) return;
      if (visible.length <= INITIAL_LIMIT) {
        viewMore.style.display = 'none';
        return;
      }
      viewMore.style.display = 'inline-flex';
      viewMore.classList.toggle('open', showingAll);
      var textSpan = viewMore.querySelector('.view-more-text');
      if (textSpan) textSpan.textContent = showingAll ? 'Show Less' : 'View More';
      for (var k = INITIAL_LIMIT; k < visible.length; k++) {
        visible[k].style.display = showingAll ? '' : 'none';
      }
      for (var l = 0; l < INITIAL_LIMIT && l < visible.length; l++) {
        visible[l].style.display = '';
      }
    }

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        for (var j = 0; j < tabs.length; j++) {
          tabs[j].classList.toggle('active', tabs[j] === this);
        }
        showingAll = false;
        show();
      });
    }

    if (viewMore) {
      viewMore.addEventListener('click', function () {
        showingAll = !showingAll;
        show();
      });
    }

    var activeTab = document.querySelector('.category-tab.active');
    if (activeTab) show();
  })();

  // ─── PACK SEARCH & CREATOR FILTER ───
  (function () {
    var searchInput = document.getElementById('pack-search');
    var cards = document.querySelectorAll('.download-card');
    var creatorTabs = document.querySelectorAll('.creator-tab');
    if (!searchInput || cards.length === 0) return;

    function filterPacks() {
      var query = searchInput.value.toLowerCase().trim();
      var active = document.querySelector('.creator-tab.active');
      var creator = active ? active.dataset.creator : 'all';

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var title = (card.querySelector('h3') || {}).textContent || '';
        var desc = (card.querySelector('.card-desc') || {}).textContent || '';
        var matchSearch = !query || title.toLowerCase().indexOf(query) !== -1 || desc.toLowerCase().indexOf(query) !== -1;
        var matchCreator = creator === 'all' || card.dataset.creator === creator;
        card.style.display = matchSearch && matchCreator ? '' : 'none';
      }
    }

    searchInput.addEventListener('input', filterPacks);

    for (var j = 0; j < creatorTabs.length; j++) {
      creatorTabs[j].addEventListener('click', function () {
        for (var k = 0; k < creatorTabs.length; k++) {
          creatorTabs[k].classList.toggle('active', creatorTabs[k] === this);
        }
        filterPacks();
      });
    }
  })();

  // ─── BACK TO TOP ───
  (function () {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8593;';
    document.body.appendChild(btn);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle('visible', window.scrollY > 600);
        ticking = false;
      });
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ─── LOADING INTRO (once per session) ───
  (function () {
    if (sessionStorage.getItem('kbjs_intro_seen')) return;
    sessionStorage.setItem('kbjs_intro_seen', '1');
    var overlay = document.createElement('div');
    overlay.className = 'kbjs-loader';
    overlay.innerHTML =
      '<img src="/logos/kbjslogo.png" alt="KBJS Studios"><span>KBJS Studios</span>';
    document.body.appendChild(overlay);
    var done = false;
    function hide() {
      if (done) return;
      done = true;
      overlay.classList.add('done');
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 650);
    }
    setTimeout(hide, 900);
    if (document.readyState === 'complete') setTimeout(hide, 200);
    else window.addEventListener('load', function () { setTimeout(hide, 250); });
  })();

  // ─── GOOGLE ANALYTICS (loads only after cookie consent) ───
  (function () {
    var MID = window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.measurementId;
    if (!MID) return;
    var injected = false;
    function inject() {
      if (injected) return;
      injected = true;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', MID, { anonymize_ip: true });
    }
    if (localStorage.getItem('kbjs_cookie_consent') === 'accepted') inject();
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'cookie-accept') inject();
    }, true);
  })();

  // ─── GALLERY LIGHTBOX ───
  (function () {
    var items = document.querySelectorAll('.gallery-item');
    if (items.length === 0) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML =
      '<button class="lb-nav lb-close" type="button" aria-label="Close">&#10005;</button>' +
      '<button class="lb-nav lb-prev" type="button" aria-label="Previous">&#10094;</button>' +
      '<figure class="lb-figure"><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-nav lb-next" type="button" aria-label="Next">&#10095;</button>';
    document.body.appendChild(box);

    var imgEl = box.querySelector('img');
    var capEl = box.querySelector('figcaption');
    var idx = 0;

    function visibleItems() {
      return Array.prototype.filter.call(items, function (el) {
        return !el.classList.contains('hidden') && el.style.display !== 'none';
      });
    }
    function show(i) {
      var list = visibleItems();
      if (list.length === 0) return;
      idx = (i + list.length) % list.length;
      var thumb = list[idx].querySelector('img');
      if (!thumb) return;
      imgEl.src = thumb.currentSrc || thumb.src;
      var h = list[idx].querySelector('h3');
      capEl.textContent = h ? h.textContent : '';
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      box.classList.remove('open');
      document.body.style.overflow = '';
    }

    items.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        show(visibleItems().indexOf(item));
      });
    });
    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();

  // ─── GAME LEADERBOARD (pages with <body data-game="...">) ───
  (function () {
    var GAME = document.body.getAttribute('data-game');
    if (!GAME) return;

    var TITLE = (document.title.replace(/\s*[\u2014\u2013-]\s*KBJS.*$/i, '').trim()) || GAME;

    var btn = document.createElement('button');
    btn.className = 'lb-btn';
    btn.type = 'button';
    btn.innerHTML = '&#127942; Leaderboard';
    document.body.appendChild(btn);

    var modal = document.createElement('div');
    modal.className = 'lb-modal';
    modal.innerHTML =
      '<div class="lb-card">' +
        '<button class="lb-x" type="button" aria-label="Close">&times;</button>' +
        '<h3>' + TITLE + ' \u2014 Top 10</h3>' +
        '<p class="lb-sub">Scores sync live when Firebase is connected.</p>' +
        '<ol class="lb-list"><li class="lb-empty">Loading\u2026</li></ol>' +
        '<div class="lb-name-row">' +
          '<input class="form-input lb-name" maxlength="16" placeholder="Your name">' +
          '<button class="glow-btn glow-btn-primary lb-save" type="button">Save name</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    var listEl = modal.querySelector('.lb-list');
    var nameInput = modal.querySelector('.lb-name');

    function getName() { return localStorage.getItem('kbjs_player_name') || ''; }
    nameInput.value = getName();
    modal.querySelector('.lb-save').addEventListener('click', function () {
      localStorage.setItem('kbjs_player_name', (nameInput.value || 'Guest').trim().substring(0, 16));
      showToast('Name saved!');
    });
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        modal.querySelector('.lb-save').click();
      }
    });

    function openModal() { modal.classList.add('open'); render(); }
    function closeModal() { modal.classList.remove('open'); }
    btn.addEventListener('click', openModal);
    modal.querySelector('.lb-x').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    function localBoard() {
      try { return JSON.parse(localStorage.getItem('kbjs_lb_' + GAME) || '[]'); }
      catch (err) { return []; }
    }
    function saveLocal(board) {
      board.sort(function (a, b) { return b.s - a.s; });
      localStorage.setItem('kbjs_lb_' + GAME, JSON.stringify(board.slice(0, 50)));
    }

    var fbRef = null;
    (function initFirebase() {
      var cfg = window.FIREBASE_CONFIG;
      if (!(cfg && cfg.databaseURL)) return;
      var waited = 0;
      var timer = setInterval(function () {
        waited += 250;
        if (window.firebase && firebase.apps && firebase.apps.length) {
          clearInterval(timer);
          fbRef = firebase.database().ref('leaderboards/' + GAME);
          fbRef.limitToLast(200).on('value', function (snap) {
            var rows = [];
            snap.forEach(function (c) { rows.push(c.val()); });
            render(rows);
          });
        } else if (waited > 5000) {
          clearInterval(timer);
          render();
        }
      }, 250);
    })();

    function render(remoteRows) {
      var rows = remoteRows || localBoard();
      rows = rows.slice().sort(function (a, b) { return b.s - a.s; }).slice(0, 10);
      if (rows.length === 0) {
        listEl.innerHTML = '<li class="lb-empty">No scores yet \u2014 be the first!</li>';
        return;
      }
      var medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];
      listEl.innerHTML = rows.map(function (r, i) {
        var rank = medals[i] || (i + 1) + '.';
        var who = String(r.n || 'Guest').replace(/[<>&]/g, '');
        var when = r.t ? new Date(r.t).toLocaleDateString() : '';
        return '<li><span class="lb-rank">' + rank + '</span>' +
               '<span class="lb-who">' + who + '</span>' +
               '<span class="lb-date">' + when + '</span>' +
               '<span class="lb-score">' + r.s + '</span></li>';
      }).join('');
    }

    window.KBJS_submitScore = function (score) {
      score = Math.max(0, Math.round(Number(score) || 0));
      if (!score) return;

      var board = localBoard();
      board.push({ n: getName() || 'Guest', s: score, t: Date.now() });
      saveLocal(board);

      if (fbRef) {
        fbRef.push({ n: getName() || 'Guest', s: score, t: Date.now() });
      } else {
        render();
      }
      showToast('Score saved to the leaderboard!');
    };
  })();

})();
