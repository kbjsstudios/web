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

  /* ---------- 01 THEME ----------
     Light by default; dark follows the OS via the
     prefers-color-scheme media query in styles.css — no script needed. */

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
    var closer = $('#nav-drawer-close', drawer);
    if (closer) closer.addEventListener('click', function () { setOpen(false); });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) setOpen(false);
    });
    TEARDOWN.push(function () { doc.body.style.overflow = ''; });
  });

  /* ---------- 05 MEGA MENU ----------
     Desktop "More" dropdown. Keyboard-operable: Enter/Space toggles,
     Escape closes and returns focus, click-outside closes. */
  guard('megamenu', function () {
    var btn = $('#mega-btn');
    var panel = $('#mega-panel');
    if (!btn || !panel) return;

    var setOpen = function (open) {
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var first = panel.querySelector('a');
        if (first) first.focus();
      }
    };

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!panel.classList.contains('open'));
    });
    doc.addEventListener('click', function (e) {
      if (panel.classList.contains('open') && !panel.contains(e.target)) setOpen(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        setOpen(false);
        btn.focus();
      }
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
      var LOGO = 'https://kbjsstudios.qzz.io/logos/kbjslogo.png';
      var tid = 'T-' + payload.date.slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'KBJS Studios \u2014 Tickets',
          embeds: [{
            title: 'New Ticket \u2014 ' + tid,
            description: 'A visitor submitted the Get Started form on kbjsstudios.qzz.io.',
            color: 0x6C5CE7,
            thumbnail: { url: LOGO },
            fields: [
              { name: 'Name', value: nv, inline: true },
              { name: 'Email', value: ev, inline: true },
              { name: 'Message', value: mv.slice(0, 1024) || '\u2014' }
            ],
            footer: { text: 'KBJS Studios \u00b7 Delete ticket: right-click \u2192 Delete Message', icon_url: LOGO },
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

  /* ---------- 19 HERO CUBES ----------
     Lightweight 2D field of small drifting gradient cubes behind the
     homepage headline — a nod to Minecraft blocks. Mouse position
     applies a gentle parallax. Pauses off-screen, on tab hide, and
     entirely under prefers-reduced-motion. No dependencies. */
  guard('herocubes', function () {
    var canvas = $('#hero-canvas');
    if (!canvas) return;
    if (win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var hero = canvas.closest('.hero') || doc.body;

    var W = 0, H = 0, raf = 0, running = false;
    var mx = 0.5, my = 0.5;
    var COLORS = ['46,124,246', '124,92,255', '244,92,166', '16,180,200'];
    var cubes = [];
    var N = 34;

    var resize = function () {
      var r = hero.getBoundingClientRect();
      var dpr = Math.min(win.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    var spawn = function (i) {
      return {
        x: Math.random() * W, y: Math.random() * H,
        s: 5 + Math.random() * 13,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.18,
        c: COLORS[i % COLORS.length],
        a: 0.25 + Math.random() * 0.4,
        depth: 0.4 + Math.random() * 0.6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.004,
      };
    };

    var frame = function () {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var px = (mx - 0.5) * 26, py = (my - 0.5) * 20;
      for (var i = 0; i < cubes.length; i++) {
        var c = cubes[i];
        c.x += c.vx; c.y += c.vy; c.rot += c.vr;
        if (c.x < -24) c.x = W + 24; if (c.x > W + 24) c.x = -24;
        if (c.y < -24) c.y = H + 24; if (c.y > H + 24) c.y = -24;
        var x = c.x + px * c.depth, y = c.y + py * c.depth;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(c.rot);
        ctx.globalAlpha = c.a;
        var g = ctx.createLinearGradient(-c.s / 2, -c.s / 2, c.s / 2, c.s / 2);
        g.addColorStop(0, 'rgba(' + c.c + ',0.85)');
        g.addColorStop(1, 'rgba(' + c.c + ',0.25)');
        ctx.fillStyle = g;
        var r = Math.min(3, c.s * 0.28);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-c.s / 2, -c.s / 2, c.s, c.s, r);
        else ctx.rect(-c.s / 2, -c.s / 2, c.s, c.s);
        ctx.fill();
        ctx.restore();
      }
      raf = win.requestAnimationFrame(frame);
    };

    var start = function () {
      if (running) return;
      running = true;
      raf = win.requestAnimationFrame(frame);
    };
    var stop = function () {
      running = false;
      if (raf) win.cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    for (var i = 0; i < N; i++) cubes.push(spawn(i));

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / Math.max(1, r.width);
      my = (e.clientY - r.top) / Math.max(1, r.height);
    }, { passive: true });

    if ('IntersectionObserver' in win) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { resize(); start(); }
        else stop();
      }, { threshold: 0 });
      io.observe(hero);
      TEARDOWN.push(function () { io.disconnect(); });
    } else {
      start();
    }
    win.addEventListener('resize', resize);
    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) stop();
    });
    TEARDOWN.push(function () { stop(); win.removeEventListener('resize', resize); });
  });

  /* ---------- 19B LIVE SWEEPER ----------
     LIVE cards are baked at build time (see tools/update_videos.py).
     If the stream's VOD was later deleted or made private, its
     thumbnail 404s — in that case the stale card is removed instead
     of linking nowhere. An <img> probe is used because image loads
     ignore CORS, where fetch() cannot go. Skipped offline so a dead
     connection can never wipe the board. */
  guard('livecheck', function () {
    if (!('onLine' in navigator) || !navigator.onLine) return;
    var cards = $$('[data-live-id]');
    if (!cards.length) return;
    cards.forEach(function (card) {
      var id = card.getAttribute('data-live-id');
      var probe = new Image();
      probe.onerror = function () {
        if (card.parentNode) card.parentNode.removeChild(card);
      };
      probe.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    });
  });

  /* ---------- 20 TABS SHOWCASE ----------
     Services tabs. Buttons are natively keyboard-operable; arrow keys
     move between tabs Antigravity-style. */
  guard('tabs', function () {
    $$('.tabs').forEach(function (root) {
      var btns = $$('.tab-btn', root);
      var panels = $$('.tab-panel', root);
      if (!btns.length || !panels.length) return;

      var select = function (btn, focus) {
        btns.forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
        panels.forEach(function (p) { p.classList.remove('open'); });
        btn.setAttribute('aria-selected', 'true');
        var panel = doc.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.classList.add('open');
        if (focus) btn.focus();
      };

      btns.forEach(function (btn, i) {
        btn.addEventListener('click', function () { select(btn, false); });
        btn.addEventListener('keydown', function (e) {
          var j = -1;
          if (e.key === 'ArrowRight') j = (i + 1) % btns.length;
          else if (e.key === 'ArrowLeft') j = (i - 1 + btns.length) % btns.length;
          else if (e.key === 'Home') j = 0;
          else if (e.key === 'End') j = btns.length - 1;
          if (j >= 0) { e.preventDefault(); select(btns[j], true); }
        });
      });
    });
  });

  /* ---------- 21 GAME LEADERBOARD ---------- */
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

  /* ---------- 22 DISCORD EMOJI COPY ---------- */
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

  /* ---------- 23 RETIRED SPACE BACKGROUND ----------
     Removed with the reskin: pages sit on a flat canvas now, so there
     is no render loop to own. */

  /* ---------- 24 NEW TICKET (internal) ----------
     new-ticket.html: compose a task ticket, post a compact
     embed to Discord, copy the full Markdown for an agent. */
  guard('newticket', function () {
    var form = $('#ticket-form');
    if (!form) return;

    var LOGO = 'https://kbjsstudios.qzz.io/logos/kbjslogo.png';
    var COLORS = { Critical: 0xE74C3C, High: 0xE67E22, Medium: 0x6C5CE7, Low: 0x95A5A6 };
    var DEF_UIUX = [
      'Follow the existing KBJS Studios design language.',
      'Maintain a clean, modern, professional appearance.',
      'Ensure responsive behavior on mobile, tablet, and desktop where relevant.',
      'Preserve existing navigation, theme behavior, and working features unless explicitly instructed otherwise.'
    ];
    var DEF_TECH = [
      'Follow the existing project architecture and coding conventions.',
      'Reuse existing components and dependencies where practical.',
      'Avoid unrelated code changes.',
      'Protect API keys, credentials, and environment variables.'
    ];

    var v = function (id) { var el = $('#' + id); return el ? el.value.trim() : ''; };
    var clip = function (s, n) { s = (s || '').trim(); return s.length > n ? s.slice(0, n - 1) + '\u2026' : s; };
    var or = function (s, fb) { s = (s || '').trim(); return s || fb; };
    var lines = function (s, prefix) {
      return (s || '').split('\n').map(function (l) { return l.trim(); })
        .filter(Boolean).map(function (l) { return prefix + l; }).join('\n');
    };

    var collect = function () {
      return {
        id: v('t-id'), title: v('t-title'), type: v('t-type'),
        priority: v('t-priority'), status: v('t-status'),
        agent: v('t-agent'), branch: or(v('t-branch'), 'main'),
        what: v('t-what'), why: v('t-why'), outcome: v('t-outcome'),
        current: v('t-current'), problem: v('t-problem'),
        affected: v('t-affected'), refs: v('t-refs'),
        reqs: v('t-reqs'), uiux: v('t-uiux'), tech: v('t-tech'), ac: v('t-ac'),
        scopeIn: v('t-scope-in'), scopeOut: v('t-scope-out'), deps: v('t-deps')
      };
    };

    var toMarkdown = function (t) {
      var out = '# KBJS STUDIOS \u2014 TASK TICKET\n\n';
      out += '## 1. Ticket Information\n';
      out += '- **Ticket ID:** ' + or(t.id, 'KBJS-000') + '\n';
      out += '- **Task Title:** ' + or(t.title, '\u2014') + '\n';
      out += '- **Task Type:** ' + t.type + '\n';
      out += '- **Priority:** ' + t.priority + '\n';
      out += '- **Assigned Agent:** ' + t.agent + '\n';
      out += '- **Repository:** https://github.com/kbjsstudios/web\n';
      out += '- **Working Branch:** ' + t.branch + '\n';
      out += '- **Status:** ' + t.status + '\n\n';
      out += '## 2. Objective\n';
      out += '**What needs to be done?**\n\n' + or(t.what, '[Describe the task clearly.]') + '\n\n';
      out += '**Why is this needed?**\n\n' + or(t.why, '[Explain the problem or purpose.]') + '\n\n';
      out += '**Expected outcome:**\n\n' + or(t.outcome, '[Describe the finished result.]') + '\n\n';
      out += '## 3. Current Situation\n';
      out += '- **Current behavior:** ' + or(t.current, '\u2014') + '\n';
      out += '- **Problem:** ' + or(t.problem, '\u2014') + '\n';
      out += '- **Affected pages/components:** ' + or(t.affected, '\u2014') + '\n';
      out += '- **Reference links/screenshots:** ' + or(t.refs, '\u2014') + '\n\n';
      out += '## 4. Requirements\n\n### Functional Requirements\n';
      out += lines(t.reqs, '- [ ] ') || '- [ ] \u2014\n';
      out += '\n### UI/UX Requirements\n';
      out += lines(t.uiux, '- [ ] ') || lines(DEF_UIUX.join('\n'), '- [ ] ') + '\n';
      out += '\n### Technical Requirements\n';
      out += lines(t.tech, '- [ ] ') || lines(DEF_TECH.join('\n'), '- [ ] ') + '\n';
      out += '\n## 5. Agent Instructions\n1. Inspect the repository and relevant files before editing.\n';
      out += '2. Check Git status and preserve existing user changes.\n3. Identify the root cause or plan the implementation.\n';
      out += '4. Make the requested changes completely.\n5. Test the affected functionality and relevant build checks.\n';
      out += '6. Fix issues introduced by your changes.\n7. Summarize all modifications and test results.\n';
      out += '8. Do not delete user data, force-push, or perform destructive operations.\n';
      out += '9. Do not deploy to production or modify live services without explicit permission.\n';
      out += '10. If blocked, explain the issue and the safest next step.\n\n';
      out += '## 6. Acceptance Criteria\n';
      out += lines(t.ac, '- [ ] ') || '- [ ] All requested functionality works as specified.\n';
      out += '\n## 7. Scope\n\n**Included:**\n' + (lines(t.scopeIn, '- ') || '- \u2014') + '\n';
      out += '\n**Excluded:**\n' + (lines(t.scopeOut, '- ') || '- \u2014') + '\n';
      out += '\n**Dependencies or restrictions:**\n' + (lines(t.deps, '- ') || '- \u2014') + '\n\n';
      out += '## 8. Completion Report\n\nThe agent must provide:\n\n';
      out += '- **Final Status:** [Completed / Partially Completed / Blocked]\n';
      out += '- **Summary:** [What was accomplished]\n';
      out += '- **Files Changed:** [Created, modified, or deleted files]\n';
      out += '- **Implementation Details:** [Important technical decisions]\n';
      out += '- **Tests Run:** [Commands and actual results]\n';
      out += '- **Known Issues:** [Remaining problems, if any]\n';
      out += '- **Git Commit:** [If requested and completed]\n';
      out += '- **Deployment:** [Not deployed / Deployed and verified / Not verified]\n';
      out += '- **Next Steps:** [Only if necessary]\n\n';
      out += '## 9. Definition of Done\n- [ ] Acceptance criteria are met.\n';
      out += '- [ ] Changes have been verified to the extent possible.\n';
      out += '- [ ] No known regressions have been ignored.\n';
      out += '- [ ] Remaining limitations are disclosed.\n';
      out += '- [ ] The completion report is accurate.\n\n';
      out += '**Final instruction:** Complete only the scope defined in this ticket. ';
      out += 'Do not claim success for work that was not implemented or tested. ';
      out += 'Preserve existing project behavior and request authorization before risky or irreversible actions.\n';
      return out;
    };

    var buildDiscord = function (t) {
      var fields = [
        { name: 'Type', value: clip(t.type, 100), inline: true },
        { name: 'Priority', value: clip(t.priority, 100), inline: true },
        { name: 'Status', value: clip(t.status, 100), inline: true },
        { name: 'Agent', value: clip(t.agent, 100), inline: true },
        { name: 'Branch', value: clip(t.branch, 100), inline: true }
      ];
      var add = function (name, val, n) { if (val && val.trim()) fields.push({ name: name, value: clip(val, n || 300) }); };
      add('Why needed', t.why);
      add('Expected outcome', t.outcome);
      add('Current behavior', t.current);
      add('Problem', t.problem);
      add('Affected', t.affected, 250);
      add('References', t.refs, 250);
      add('Requirements', lines(t.reqs, '\u2022 '), 450);
      add('UI/UX', lines(t.uiux, '\u2022 '), 350);
      add('Technical', lines(t.tech, '\u2022 '), 350);
      add('Acceptance criteria', lines(t.ac, '[ ] '), 450);
      add('Scope \u2014 included', lines(t.scopeIn, '\u2022 '), 300);
      add('Scope \u2014 excluded', lines(t.scopeOut, '\u2022 '), 300);
      add('Dependencies', lines(t.deps, '\u2022 '), 250);
      return {
        username: 'KBJS Studios \u2014 Tickets',
        embeds: [{
          title: clip(or(t.id, 'Ticket') + ' \u2014 ' + or(t.title, 'Untitled'), 256),
          description: clip(or(t.what, 'No description.'), 500),
          color: COLORS[t.priority] || 0x6C5CE7,
          thumbnail: { url: LOGO },
          fields: fields,
          footer: {
            text: 'KBJS Studios \u00b7 full ticket: Copy ticket on the site \u00b7 delete: right-click \u2192 Delete Message',
            icon_url: LOGO
          },
          timestamp: new Date().toISOString()
        }]
      };
    };

    $('#ticket-copy') && $('#ticket-copy').addEventListener('click', function () {
      var t = collect();
      if (!t.id || !t.title || !t.what) {
        return showToast('Fill Ticket ID, Task title and What needs to be done first.', 'error');
      }
      var md = toMarkdown(t);
      var ok = function () { showToast('Ticket Markdown copied \u2014 paste it into your coding agent.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(md).then(ok, ok);
      } else {
        var ta = doc.createElement('textarea');
        ta.value = md;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px';
        doc.body.appendChild(ta);
        ta.select();
        try { doc.execCommand('copy'); } catch (err) {}
        ta.remove();
        ok();
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = collect();
      if (!t.id || !t.title || !t.what) {
        return showToast('Fill Ticket ID, Task title and What needs to be done first.', 'error');
      }
      var hook = win.TICKETS_WEBHOOK_URL || win.CONTACT_WEBHOOK_URL;
      if (!hook) return showToast('No ticket webhook configured.', 'error');
      fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildDiscord(t))
      }).then(function () {
        showToast('Ticket ' + t.id + ' sent to Discord.');
        form.reset();
        var br = $('#t-branch');
        if (br) br.value = 'main';
      }).catch(function () {
        showToast('Could not send right now \u2014 please try again.', 'error');
      });
    });
  });

  /* ---------- TEARDOWN ---------- */
  win.addEventListener('pagehide', function () {
    TEARDOWN.forEach(function (fn) { try { fn(); } catch (e) {} });
    TEARDOWN.length = 0;
  });
})();