/* ============================================================
   KBJS STUDIOS — APPLICATION
   ------------------------------------------------------------
   Every module is independently guarded, so a failure in one can
   never take down the page. All listeners/timers/observers that
   are created here are torn down by the pagehide handler.
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var win = window;
  var $ = function (sel, root) { return (root || doc).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(sel));
  };
  var TEARDOWN = [];

  function guard(name, fn) {
    try { fn(); } catch (e) {
      if (win.console && console.warn) console.warn('[KBJS] ' + name + ' failed:', e);
    }
  }

  /* ---------- 01 THEME ---------- */
  // Applied by an inline head script to avoid a flash; reasserted here so
  // the <body> classes the stylesheet keys off always exist.
  guard('theme', function () {
    var saved = null;
    try { saved = localStorage.getItem('kbjs_theme'); } catch (e) {}
    var prefersLight = win.matchMedia &&
      win.matchMedia('(prefers-color-scheme: light)').matches;
    var light = saved === 'light' || (!saved && prefersLight);

    doc.body.classList.toggle('light-theme', light);
    doc.body.classList.toggle('dark-theme', !light);
    doc.documentElement.classList.toggle('theme-light', light);

    $$('.theme-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = !doc.body.classList.contains('light-theme');
        doc.body.classList.toggle('light-theme', next);
        doc.body.classList.toggle('dark-theme', !next);
        doc.documentElement.classList.toggle('theme-light', next);
        try { localStorage.setItem('kbjs_theme', next ? 'light' : 'dark'); } catch (e) {}
        showToast(next ? 'Light mode' : 'Dark mode');
      });
    });
  });

  /* ---------- 02 TOAST ---------- */
  var showToast = function (message, type) {
    var box = $('#toast-container');
    if (!box) return;
    var t = doc.createElement('div');
    t.className = 'toast ' + (type || 'success');
    // textContent, not innerHTML: message may originate from user input
    var mark = doc.createElement('span');
    mark.textContent = type === 'error' ? '\u2715' : '\u2713';
    var body = doc.createElement('span');
    body.textContent = message;
    t.appendChild(mark);
    t.appendChild(body);
    box.appendChild(t);
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateX(100%)';
      setTimeout(function () { t.remove(); }, 320);
    }, 3000);
  };
  win.showToast = showToast;

  /* ---------- 03 NAV: scroll state + active page ---------- */
  guard('nav', function () {
    var shell = $('.nav-shell');
    if (!shell) return;
    var ticking = false;

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      win.requestAnimationFrame(function () {
        shell.setAttribute('data-scrolled', win.scrollY > 24 ? 'true' : 'false');
        ticking = false;
      });
    };
    win.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    TEARDOWN.push(function () { win.removeEventListener('scroll', onScroll); });

    // Active link, derived from the filename so it never goes stale.
    var here = (win.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('.nav-link').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
      if (href === here) a.setAttribute('aria-current', 'page');
    });
  });

  /* ---------- 04 MOBILE DRAWER ---------- */
  guard('drawer', function () {
    var toggle = $('#mobile-toggle');
    var drawer = $('#nav-drawer');
    if (!toggle || !drawer) return;

    var lastFocus = null;

    var setOpen = function (open) {
      drawer.classList.toggle('open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      doc.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        lastFocus = doc.activeElement;
        var first = drawer.querySelector('a, button');
        if (first) first.focus();
      } else if (lastFocus) {
        lastFocus.focus();
      }
    };

    toggle.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('open'));
    });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) setOpen(false);
    });
    TEARDOWN.push(function () { doc.body.style.overflow = ''; });
  });

  /* ---------- 05 RESOURCES DRAWER (legacy "MORE") ---------- */
  guard('resources', function () {
    var toggle = $('#more-sidebar-toggle');
    var sidebar = $('#more-sidebar');
    var overlay = $('#more-sidebar-overlay');
    var closeBtn = $('#more-sidebar-close');
    if (!toggle || !sidebar || !overlay) return;

    var setOpen = function (open) {
      sidebar.classList.toggle('open', open);
      overlay.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      sidebar.setAttribute('aria-hidden', open ? 'false' : 'true');
      doc.body.style.overflow = open ? 'hidden' : '';
      if (open && closeBtn) closeBtn.focus();
    };

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!sidebar.classList.contains('open'));
    });
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
    overlay.addEventListener('click', function () { setOpen(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  });

  /* ---------- 06 CUSTOM CURSOR (progressive enhancement) ---------- */
  guard('cursor', function () {
    var fine = win.matchMedia && win.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var dot = doc.createElement('div');
    dot.className = 'custom-cursor-dot';
    var ring = doc.createElement('div');
    ring.className = 'custom-cursor-ring';
    doc.body.appendChild(dot);
    doc.body.appendChild(ring);
    // Only now is it safe to hide the native cursor
    doc.body.classList.add('js-cursor');

    var onMove = function (e) {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    };
    var onLeave = function () {
      dot.style.visibility = 'hidden';
      ring.style.visibility = 'hidden';
    };
    var onEnter = function () {
      dot.style.visibility = 'visible';
      ring.style.visibility = 'visible';
    };
    var onOver = function (e) {
      var hit = e.target && e.target.closest &&
        e.target.closest('a, button, select, textarea, input, summary, .glass-panel, .service-card, .work-card');
      doc.body.classList.toggle('cursor-hover', !!hit);
    };
    var onDown = function () { doc.body.classList.add('cursor-click'); };
    var onUp = function () { doc.body.classList.remove('cursor-click'); };

    win.addEventListener('mousemove', onMove, { passive: true });
    win.addEventListener('mouseout', onLeave);
    win.addEventListener('mouseover', onEnter);
    doc.addEventListener('mouseover', onOver, true);
    doc.addEventListener('mousedown', onDown, true);
    doc.addEventListener('mouseup', onUp, true);

    TEARDOWN.push(function () {
      win.removeEventListener('mousemove', onMove);
      win.removeEventListener('mouseout', onLeave);
      win.removeEventListener('mouseover', onEnter);
      doc.removeEventListener('mouseover', onOver, true);
      doc.removeEventListener('mousedown', onDown, true);
      doc.removeEventListener('mouseup', onUp, true);
      dot.remove(); ring.remove();
      doc.body.classList.remove('js-cursor', 'cursor-hover', 'cursor-click');
    });
  });

  /* ---------- 07 POINTER-REACTIVE CARDS ---------- */
  // Cheap: writes two CSS custom properties, no layout thrash, no rAF loop.
  guard('cards', function () {
    if (!win.matchMedia || !win.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cards = $$('.service-card');
    if (!cards.length) return;

    var pending = null;
    var flush = function () {
      pending = null;
      var e = flush._e;
      for (var i = 0; i < cards.length; i++) {
        var r = cards[i].getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) continue;
        cards[i].style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        cards[i].style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      }
    };

    var onMove = function (e) {
      flush._e = e;
      if (pending) return;
      pending = win.requestAnimationFrame(flush);
    };
    win.addEventListener('mousemove', onMove, { passive: true });
    TEARDOWN.push(function () {
      win.removeEventListener('mousemove', onMove);
      if (pending) win.cancelAnimationFrame(pending);
    });
  });

  /* ---------- 08 SCROLL REVEAL ---------- */
  guard('reveal', function () {
    var targets = $$('[data-reveal], .service-card, .work-card, .why-card, .workflow-step, .stat-tile, .section-head, .cta-section, .panel');
    if (!targets.length) return;

    targets.forEach(function (el, i) {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
    });

    if (!('IntersectionObserver' in win)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // stagger siblings within the same parent for a choreographed feel
        var sibs = el.parentNode ? $$('[data-reveal]', el.parentNode) : [];
        var idx = sibs.indexOf(el);
        el.style.setProperty('--reveal-delay', (idx > 0 ? Math.min(idx, 6) * 70 : 0) + 'ms');
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });
    TEARDOWN.push(function () { io.disconnect(); });
  });

  /* ---------- 09 FAQ ACCORDION ---------- */
  guard('faq', function () {
    var items = $$('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var q = $('.faq-question', item);
      var a = $('.faq-answer', item);
      if (!q || !a) return;

      // If the author used a div, upgrade it to a real button for keyboard use
      if (q.tagName !== 'BUTTON') {
        var btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = q.className;
        btn.setAttribute('aria-expanded', 'false');
        while (q.firstChild) btn.appendChild(q.firstChild);
        q.replaceWith(btn);
        q = btn;
      }

      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('active');
        items.forEach(function (other) {
          other.classList.remove('active');
          var oq = $('.faq-question', other);
          var oa = $('.faq-answer', other);
          if (oq && oq.setAttribute) oq.setAttribute('aria-expanded', 'false');
          if (oa) oa.style.maxHeight = '';
        });
        if (!isOpen) {
          item.classList.add('active');
          q.setAttribute('aria-expanded', 'true');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  });

  /* ---------- 10 STATS + LIKES ---------- */
  guard('stats', function () {
    var cfg = win.FIREBASE_CONFIG;
    var useFirebase = cfg && cfg.databaseURL;
    var KEY = 'kbjs_stats', LIKED = 'kbjs_liked', VIEWED = 'kbjs_viewed';

    var state = { views: 0, likes: 0, liked: false };
    try { state.liked = localStorage.getItem(LIKED) === 'true'; } catch (e) {}

    var widget = doc.createElement('div');
    widget.className = 'stats-widget';

    var dot = doc.createElement('span');
    dot.className = 'stats-dot';
    widget.appendChild(dot);

    var views = doc.createElement('span');
    views.className = 'stat-item';
    views.textContent = '—';
    widget.appendChild(views);

    var sep = doc.createElement('span');
    sep.className = 'stat-sep';
    sep.textContent = '·';
    widget.appendChild(sep);

    var likeBtn = doc.createElement('button');
    likeBtn.type = 'button';
    likeBtn.className = 'like-btn-stats' + (state.liked ? ' liked' : '');
    likeBtn.setAttribute('aria-label', 'Like this site');
    var heart = doc.createElement('span');
    heart.className = 'heart-icon';
    var likes = doc.createElement('span');
    likes.className = 'stat-count';
    likes.textContent = '—';
    likeBtn.appendChild(heart);
    likeBtn.appendChild(likes);
    widget.appendChild(likeBtn);

    // Screen-reader friendly, avoids shipping two inline SVGs
    var HEART = { on: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
                 off: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5 2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' };
    var paint = function (on) {
      heart.textContent = on ? '♥' : '♡';
      heart.style.color = on ? 'var(--rose)' : '';
    };
    paint(state.liked);
    doc.body.appendChild(widget);

    var write = function () {
      views.textContent = state.views.toLocaleString();
      likes.textContent = state.likes.toLocaleString();
      likeBtn.classList.toggle('liked', state.liked);
      paint(state.liked);
    };

    var bump = function (ref, key) {
      if (state.liked && key === 'likes') return;
      if (key === 'likes') { state.liked = true; try { localStorage.setItem(LIKED, 'true'); } catch (e) {} }
      ref.child(key).transaction(function (cur) { return (cur || 0) + 1; });
      write();
    };

    if (useFirebase) {
      // Load SDKs without blocking first paint
      ['firebase-app.js', 'firebase-database.js'].forEach(function (f) {
        var s = doc.createElement('script');
        s.src = 'https://www.gstatic.com/firebasejs/8.10.1/' + f;
        s.async = false;
        doc.head.appendChild(s);
      });
      var last = doc.getElementsByTagName('script')[0];
      var onReady = function () {
        if (!win.firebase) { setTimeout(onReady, 120); return; }
        if (!firebase.apps.length) firebase.initializeApp(cfg);
        var ref = firebase.database().ref('stats');
        ref.on('value', function (snap) {
          var d = snap.val() || {};
          state.views = d.views || 0;
          state.likes = d.likes || 0;
          write();
        });
        if (!sessionStorage.getItem(VIEWED)) {
          sessionStorage.setItem(VIEWED, '1');
          bump(ref, 'views');
        }
        likeBtn.addEventListener('click', function () { bump(ref, 'likes'); });
      };
      onReady();
    } else {
      var stored = { views: 0, likes: 0 };
      try { stored = JSON.parse(localStorage.getItem(KEY)) || stored; } catch (e) {}
      state.views = stored.views || 0;
      state.likes = stored.likes || 0;
      write();
      if (!sessionStorage.getItem(VIEWED)) {
        sessionStorage.setItem(VIEWED, '1');
        state.views++;
        try { localStorage.setItem(KEY, JSON.stringify({ views: state.views, likes: state.likes })); } catch (e) {}
        write();
      }
      likeBtn.addEventListener('click', function () {
        if (state.liked) return;
        state.liked = true;
        try { localStorage.setItem(LIKED, 'true'); } catch (e) {}
        state.likes++;
        try { localStorage.setItem(KEY, JSON.stringify({ views: state.views, likes: state.likes })); } catch (e) {}
        write();
      });
    }
  });

  /* ---------- 11 CONTACT FORM ---------- */
  guard('contact', function () {
    var form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#contact-name'), email = $('#contact-email'), msg = $('#contact-message');
      if (!name || !email || !msg) return;

      var nv = name.value.trim().slice(0, 80);
      var ev = email.value.trim().slice(0, 160);
      var mv = msg.value.trim().slice(0, 2000);

      if (!nv || !ev || !mv) return showToast('Please fill in all required fields.', 'error');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ev)) return showToast('Please enter a valid email address.', 'error');

      var payload = { date: new Date().toISOString(), name: nv, email: ev, message: mv };

      var inq = [];
      try {
        inq = JSON.parse(localStorage.getItem('kbjs_inquiries') || '[]');
        if (!Array.isArray(inq)) inq = [];
      } catch (err) { inq = []; }
      inq.push({ date: payload.date, name: nv, email: ev, message: mv.slice(0, 50) + '\u2026' });
      try { localStorage.setItem('kbjs_inquiries', JSON.stringify(inq.slice(-50))); } catch (err) {}

      var hook = win.CONTACT_WEBHOOK_URL;
      if (!hook) {
        showToast('Message sent! We will get back to you within 24 hours.');
        form.reset();
        return;
      }
      fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'KBJS Studios \u2014 Contact Form',
          embeds: [{
            title: 'New Inquiry', color: 0xd8b478,
            fields: [
              { name: 'Name', value: nv, inline: true },
              { name: 'Email', value: ev, inline: true },
              { name: 'Message', value: mv.slice(0, 1024) || '\u2014' }
            ],
            timestamp: payload.date
          }]
        })
      }).then(function () {
        showToast('Message sent! We will get back to you within 24 hours.');
        form.reset();
      }).catch(function () {
        showToast('Could not send right now \u2014 please try again.', 'error');
      });
    });
  });

  /* ---------- 12 COOKIE CONSENT ---------- */
  guard('cookies', function () {
    var seen = null;
    try { seen = localStorage.getItem('kbjs_cookie_consent'); } catch (e) {}
    if (seen) return;

    var banner = doc.createElement('div');
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie preferences');

    var inner = doc.createElement('div');
    inner.className = 'cookie-consent-inner';
    var p = doc.createElement('p');
    p.textContent = 'We use cookies to improve your experience. ';
    var link = doc.createElement('a');
    link.href = 'privacy.html';
    link.textContent = 'Read our Privacy Policy';
    p.appendChild(link);

    var btns = doc.createElement('div');
    btns.className = 'cookie-buttons';
    var decline = doc.createElement('button');
    decline.type = 'button';
    decline.className = 'cookie-btn cookie-btn-decline';
    decline.id = 'cookie-decline';
    decline.textContent = 'Decline';
    var accept = doc.createElement('button');
    accept.type = 'button';
    accept.className = 'cookie-btn cookie-btn-accept';
    accept.id = 'cookie-accept';
    accept.textContent = 'Accept';
    btns.appendChild(decline);
    btns.appendChild(accept);
    inner.appendChild(p);
    inner.appendChild(btns);
    banner.appendChild(inner);
    doc.body.appendChild(banner);

    var done = function (v) {
      try { localStorage.setItem('kbjs_cookie_consent', v); } catch (e) {}
      banner.remove();
    };
    accept.addEventListener('click', function () { done('accepted'); });
    decline.addEventListener('click', function () { done('declined'); });

    requestAnimationFrame(function () { banner.classList.add('show'); });
  });

  /* ---------- 13 ANALYTICS (consent-gated) ---------- */
  guard('analytics', function () {
    var MID = win.FIREBASE_CONFIG && win.FIREBASE_CONFIG.measurementId;
    if (!MID) return;
    var loaded = false;
    function load() {
      if (loaded) return;
      loaded = true;
      var s = doc.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MID;
      doc.head.appendChild(s);
      win.dataLayer = win.dataLayer || [];
      function gtag() { win.dataLayer.push(arguments); }
      win.gtag = gtag;
      gtag('js', new Date());
      gtag('config', MID, { anonymize_ip: true });
    }
    var consent = null;
    try { consent = localStorage.getItem('kbjs_cookie_consent'); } catch (e) {}
    if (consent === 'accepted') load();
    doc.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'cookie-accept') load();
    }, true);
  });

  /* ---------- 14 FILTER TABS (thumbnails + downloads) ---------- */
  guard('filters', function () {
    $$('.filter-bar').forEach(function (bar) {
      var tabs = $$('[data-filter]', bar);
      if (!tabs.length) return;
      var targetSel = bar.getAttribute('data-target');
      var items = targetSel ? $$(targetSel) : [];

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          var val = tab.getAttribute('data-filter');
          items.forEach(function (item) {
            var cats = (item.getAttribute('data-cats') || '').split(' ');
            item.classList.toggle('hidden', val !== 'all' && cats.indexOf(val) === -1);
            item.style.display = (val === 'all' || cats.indexOf(val) !== -1) ? '' : 'none';
          });
        });
      });
    });
  });

  /* ---------- 15 SEARCH FILTER (downloads) ---------- */
  guard('search', function () {
    var input = $('[data-search]');
    if (!input) return;
    var sel = input.getAttribute('data-search');
    var items = $$(sel);
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      items.forEach(function (it) {
        var txt = (it.textContent || '').toLowerCase();
        var show = !q || txt.indexOf(q) !== -1;
        it.classList.toggle('hidden', !show);
        it.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- 16 LIGHTBOX ---------- */
  guard('lightbox', function () {
    var items = $$('.gallery-item');
    if (!items.length) return;

    var box = doc.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image preview');

    var close = doc.createElement('button');
    close.className = 'lb-nav lb-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Close preview');
    close.textContent = '\u2715';

    var prev = doc.createElement('button');
    prev.className = 'lb-nav lb-prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous image');
    prev.textContent = '\u276E';

    var next = doc.createElement('button');
    next.className = 'lb-nav lb-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next image');
    next.textContent = '\u276F';

    var fig = doc.createElement('figure');
    fig.className = 'lb-figure';
    var img = doc.createElement('img');
    img.alt = '';
    var cap = doc.createElement('figcaption');
    fig.appendChild(img);
    fig.appendChild(cap);

    box.appendChild(close); box.appendChild(prev); box.appendChild(fig); box.appendChild(next);
    doc.body.appendChild(box);

    var idx = 0, lastFocus = null;

    var visible = function () {
      return items.filter(function (el) {
        return !el.classList.contains('hidden') && el.style.display !== 'none';
      });
    };
    var show = function (i) {
      var list = visible();
      if (!list.length) return;
      idx = (i + list.length) % list.length;
      var thumb = list[idx].querySelector('img');
      if (!thumb) return;
      img.src = thumb.currentSrc || thumb.src;
      img.alt = thumb.getAttribute('alt') || '';
      var h = list[idx].querySelector('h3');
      cap.textContent = h ? h.textContent : '';
      box.classList.add('open');
      doc.body.style.overflow = 'hidden';
      close.focus();
    };
    var hide = function () {
      box.classList.remove('open');
      doc.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    items.forEach(function (it) {
      it.setAttribute('tabindex', '0');
      it.setAttribute('role', 'button');
      var act = function (e) {
        e.preventDefault();
        lastFocus = it;
        show(visible().indexOf(it));
      };
      it.addEventListener('click', act);
      it.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') act(e);
      });
    });

    close.addEventListener('click', hide);
    prev.addEventListener('click', function () { show(idx - 1); });
    next.addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) hide(); });
    doc.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    TEARDOWN.push(function () { doc.body.style.overflow = ''; });
  });

  /* ---------- 17 BACK TO TOP ---------- */
  guard('backtotop', function () {
    var btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.textContent = '\u2191';
    doc.body.appendChild(btn);

    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      win.requestAnimationFrame(function () {
        btn.classList.toggle('visible', win.scrollY > 700);
        ticking = false;
      });
    };
    win.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', function () {
      win.scrollTo({ top: 0, behavior: 'smooth' });
    });
    TEARDOWN.push(function () { win.removeEventListener('scroll', onScroll); btn.remove(); });
  });

  /* ---------- 18 HERO CONSOLE (brand signature) ---------- */
  guard('console', function () {
    var body = $('#console-body');
    if (!body) return;

    var LINES = [
      { p: '$ ', t: 'kbjs --services', o: null },
      { p: '', t: 'thumbnails  discord  minecraft  video', html: true,
        o: '<a href="thumbnails.html" style="color:var(--gold)">Thumbnails</a> \u00B7 ' +
           '<a href="discord.html" style="color:var(--gold)">Discord</a> \u00B7 ' +
           '<a href="minecraft.html" style="color:var(--gold)">Minecraft</a> \u00B7 ' +
           '<a href="video.html" style="color:var(--gold)">Video</a>' },
      { p: '$ ', t: 'kbjs --status', o: 'available for new projects' },
      { p: '$ ', t: 'kbjs --say "lets build"', o: 'ok \u2014 start at /contact.html' }
    ];
    var li = 0;

    function type(el, text, done) {
      var i = 0;
      var iv = setInterval(function () {
        el.textContent += text.charAt(i++);
        if (i >= text.length) { clearInterval(iv); if (done) done(); }
      }, 38);
      TEARDOWN.push(function () { clearInterval(iv); });
    }

    function step() {
      if (li >= LINES.length) {
        li = 0;
        setTimeout(function () { while (body.firstChild) body.removeChild(body.firstChild); step(); }, 4200);
        return;
      }
      var data = LINES[li++];
      var row = doc.createElement('div');
      row.className = 'console-line';
      var prompt = doc.createElement('span');
      prompt.className = 'console-prompt';
      prompt.textContent = data.p;
      var cmd = doc.createElement('span');
      cmd.className = 'console-output';
      row.appendChild(prompt);
      row.appendChild(cmd);
      body.appendChild(row);

      type(cmd, data.t, function () {
        if (!data.o) return;
        setTimeout(function () {
          var out = doc.createElement('div');
          out.style.cssText = 'opacity:0;padding-left:12px;font-size:0.78rem;';
          if (data.html) {
            // Author-controlled literal markup only (no user input reaches this)
            out.innerHTML = data.o;
          } else {
            out.textContent = data.o;
          }
          body.appendChild(out);
          body.scrollTop = body.scrollHeight;
        }, 260);
      });
    }

    if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // No typing animation — render the final state immediately
      LINES.forEach(function (d) {
        var row = doc.createElement('div');
        row.className = 'console-line';
        var prompt = doc.createElement('span');
        prompt.className = 'console-prompt';
        prompt.textContent = d.p;
        var cmd = doc.createElement('span');
        cmd.className = 'console-output';
        cmd.textContent = d.t;
        row.appendChild(prompt); row.appendChild(cmd);
        if (d.o) {
          var out = doc.createElement('div');
          out.style.cssText = 'padding-left:12px;font-size:0.78rem;';
          if (d.html) out.innerHTML = d.o; else out.textContent = d.o;
          body.appendChild(row); body.appendChild(out);
        } else {
          body.appendChild(row);
        }
      });
      return;
    }

    setTimeout(step, 600);
  });

  /* ---------- 19 GAME LEADERBOARD ---------- */
  guard('leaderboard', function () {
    var GAME = doc.body.getAttribute('data-game');
    if (!GAME) return;

    var TITLE = (doc.title.replace(/\s*[\u2014\u2013-]\s*KBJS.*$/i, '').trim()) || GAME;

    var btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'lb-btn';
    btn.textContent = 'Leaderboard';
    doc.body.appendChild(btn);

    var modal = doc.createElement('div');
    modal.className = 'lb-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', TITLE + ' leaderboard');

    var card = doc.createElement('div');
    card.className = 'lb-card';
    var x = doc.createElement('button');
    x.type = 'button'; x.className = 'lb-x'; x.setAttribute('aria-label', 'Close');
    x.textContent = '\u00D7';
    var h = doc.createElement('h3');
    h.textContent = TITLE + ' \u2014 Top 10';
    var sub = doc.createElement('p');
    sub.className = 'lb-sub';
    sub.textContent = 'Scores sync live when Firebase is connected.';
    var list = doc.createElement('ol');
    list.className = 'lb-list';
    var empty = doc.createElement('li');
    empty.className = 'lb-empty';
    empty.textContent = 'Loading\u2026';
    list.appendChild(empty);
    var nameRow = doc.createElement('div');
    nameRow.className = 'lb-name-row';
    var nameInput = doc.createElement('input');
    nameInput.className = 'form-input lb-name';
    nameInput.maxLength = 16;
    nameInput.placeholder = 'Your name';
    nameInput.setAttribute('aria-label', 'Leaderboard display name');
    var saveBtn = doc.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-primary lb-save';
    saveBtn.textContent = 'Save name';
    nameRow.appendChild(nameInput);
    nameRow.appendChild(saveBtn);
    card.appendChild(x); card.appendChild(h); card.appendChild(sub);
    card.appendChild(list); card.appendChild(nameRow);
    modal.appendChild(card);
    doc.body.appendChild(modal);

    var KEY = 'kbjs_lb_' + GAME;
    var NAME = 'kbjs_player_name';

    var readLocal = function () {
      try {
        var v = JSON.parse(localStorage.getItem(KEY) || '[]');
        return Array.isArray(v) ? v : [];
      } catch (e) { return []; }
    };
    var writeLocal = function (rows) {
      try { localStorage.setItem(KEY, JSON.stringify(rows.slice(-200))); } catch (e) {}
    };
    var getName = function () { try { return localStorage.getItem(NAME) || ''; } catch (e) { return ''; } };
    nameInput.value = getName();

    saveBtn.addEventListener('click', function () {
      var v = (nameInput.value || 'Guest').trim().slice(0, 16) || 'Guest';
      try { localStorage.setItem(NAME, v); } catch (e) {}
      showToast('Name saved!');
      render();
    });
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); saveBtn.click(); }
    });

    var render = function (remote) {
      var rows = (remote || readLocal()).slice()
        .filter(function (r) { return r && typeof r === 'object'; })
        .sort(function (a, b) { return (Number(b.s) || 0) - (Number(a.s) || 0); })
        .slice(0, 10);

      list.textContent = '';
      if (!rows.length) {
        var none = doc.createElement('li');
        none.className = 'lb-empty';
        none.textContent = 'No scores yet \u2014 be the first!';
        list.appendChild(none);
        return;
      }
      var medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];
      rows.forEach(function (r, i) {
        var li = doc.createElement('li');
        var rank = doc.createElement('span');
        rank.className = 'lb-rank';
        rank.textContent = medals[i] || (i + 1) + '.';
        var who = doc.createElement('span');
        who.className = 'lb-who';
        // Sanitized: remote text is never inserted as markup
        who.textContent = String(r.n || 'Guest').replace(/[<>&"']/g, '').slice(0, 16) || 'Guest';
        var when = doc.createElement('span');
        when.className = 'lb-date';
        when.textContent = r.t ? new Date(Number(r.t) || 0).toLocaleDateString() : '';
        var score = doc.createElement('span');
        score.className = 'lb-score';
        score.textContent = String(Math.max(0, Math.round(Number(r.s) || 0)));
        li.appendChild(rank); li.appendChild(who); li.appendChild(when); li.appendChild(score);
        list.appendChild(li);
      });
    };

    var fbRef = null;
    var cfg = win.FIREBASE_CONFIG;
    if (cfg && cfg.databaseURL) {
      var poll = setInterval(function () {
        if (win.firebase) {
          clearInterval(poll);
          if (!firebase.apps.length) firebase.initializeApp(cfg);
          fbRef = firebase.database().ref('scores/' + GAME);
          fbRef.limitToLast(200).on('value', function (snap) {
            var rows = [];
            snap.forEach(function (c) { rows.push(c.val()); });
            render(rows);
          });
        }
      }, 250);
      TEARDOWN.push(function () { clearInterval(poll); if (fbRef) fbRef.off(); });
    }

    win.KBJS_submitScore = function (score) {
      var s = Math.max(0, Math.round(Number(score) || 0));
      if (!s) return;
      var row = { n: getName() || 'Guest', s: s, t: Date.now() };
      var rows = readLocal();
      rows.push(row);
      writeLocal(rows);
      if (fbRef) fbRef.push(row);
      else render();
      showToast('Score saved to the leaderboard!');
    };

    var open = function () { modal.classList.add('open'); render(); doc.body.style.overflow = 'hidden'; x.focus(); };
    var closeM = function () { modal.classList.remove('open'); doc.body.style.overflow = ''; btn.focus(); };
    btn.addEventListener('click', open);
    x.addEventListener('click', closeM);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeM(); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeM();
    });
    TEARDOWN.push(function () { doc.body.style.overflow = ''; });
  });

  /* ---------- 20 DISCORD EMOJI COPY ---------- */
  guard('emojis', function () {
    var grid = $('.emoji-grid');
    if (!grid) return;
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.emoji-card');
      if (!card) return;
      var val = card.getAttribute('data-emoji') || '';
      var ok = function () {
        var hint = $('#emoji-copy-hint');
        if (hint) hint.textContent = 'Copied ' + val + ' \u2014 paste it in Discord.';
        showToast('Copied ' + val);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(ok, ok);
      } else {
        var ta = doc.createElement('textarea');
        ta.value = val;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px';
        doc.body.appendChild(ta);
        ta.select();
        try { doc.execCommand('copy'); } catch (err) {}
        ta.remove();
        ok();
      }
    });
  });

  /* ---------- 21 SPACE BACKGROUND (WebGL galaxy) ----------
     galaxy/index.js is an ES module and self-boots on DOMContentLoaded,
     publishing window.__galaxy. This block only keeps a handle so the
     pagehide teardown below can stop the render loop cleanly. Module
     execution order means the module may not have run yet when this
     executes, so the handle is resolved lazily at teardown. */
  guard('galaxy', function () {
    window.KBJSGalaxy = {
      get instance() { return window.__galaxy || null; },
      pause() { var g = window.__galaxy; if (g && g.setPaused) g.setPaused(true); },
      resume() { var g = window.__galaxy; if (g && g.setPaused) g.setPaused(false); },
      dispose() { var g = window.__galaxy; if (g && g.dispose) g.dispose(); },
    };
  });

  /* ---------- TEARDOWN ---------- */
  win.addEventListener('pagehide', function () {
    TEARDOWN.forEach(function (fn) { try { fn(); } catch (e) {} });
    TEARDOWN.length = 0;
    if (win.KBJSGalaxy) { try { win.KBJSGalaxy.dispose(); } catch (e) {} }
    var gw = doc.getElementById('galaxy-widget');
    if (gw) gw.remove();
    delete win.__galaxy;
  });
})();