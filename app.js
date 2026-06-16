/* ====================================================================
   KBJS Studios — app.js (UI Shell / Design Only)
   Core: particles · header · mobile menu · terminal console · reveal
   ==================================================================== */

// ─── GLASS BLUR VAR ──────────────────────────────────────────────────────────
document.documentElement.style.setProperty('--glass-blur', 'blur(20px)');

// ─── PARTICLE CANVAS & CONSTELLATION TRAIL ──────────────────────────────────
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const NUM = 85;

  let mouse = { x: null, y: null, active: false };
  let lastSpawn = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); spawnParticles(); });

  function rand(min, max) { return Math.random() * (max - min) + min; }

  const COLORS = ['#00f2fe', '#7f00ff', '#ff007f', '#00d4ff', '#9b00ff'];

  function spawnParticles() {
    particles = [];
    for (let i = 0; i < NUM; i++) {
      particles.push({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
        r: rand(1, 2.5),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: rand(0.15, 0.6)
      });
    }
  }
  spawnParticles();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    const now = Date.now();
    if (now - lastSpawn > 35) {
      lastSpawn = now;
      particles.push({
        x: mouse.x,
        y: mouse.y,
        vx: rand(-0.6, 0.6),
        vy: rand(-0.6, 0.6),
        r: rand(1.5, 3),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.8,
        life: 50,
        maxLife: 50
      });
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,242,254,${0.07 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particles[i].x, particles[i].y);
          ctx.strokeStyle = `rgba(91, 79, 255, ${0.22 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.95;
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    
    particles = particles.filter(p => {
      p.x += p.vx; p.y += p.vy;
      
      if (p.life !== undefined) {
        p.life--;
        p.alpha = (p.life / p.maxLife) * 0.8;
        return p.life > 0;
      } else {
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        return true;
      }
    });

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    drawLines();
    requestAnimationFrame(tick);
  }
  tick();
})();

// ─── MOBILE MENU ──────────────────────────────────────────────────────────────
(function () {
  const toggle   = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('mobile-active'));
  });
})();

// ─── HEADER SCROLL EFFECT ─────────────────────────────────────────────────────
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
})();

// ─── TERMINAL CONSOLE TYPEWRITER ──────────────────────────────────────────────
(function () {
  const body = document.getElementById('console-body');
  if (!body) return;

  const lines = [
    { prompt: '$ ', text: 'kbjs --version',        output: 'KBJS Studios v1.0.0',             outColor: '#38bdf8' },
    { prompt: '$ ', text: 'kbjs services --list',   output: '<a href="thumbnails.html" style="color:var(--primary);text-decoration:none;">Thumbnails</a> · <a href="discord.html" style="color:var(--primary);text-decoration:none;">Discord</a> · <a href="minecraft.html" style="color:var(--primary);text-decoration:none;">Minecraft</a> · <a href="video.html" style="color:var(--primary);text-decoration:none;">Video</a>', outColor: null },
    { prompt: '$ ', text: 'kbjs status',            output: '✓ Available for new projects',   outColor: null },
    { prompt: '$ ', text: 'exit',                   output: '',                              outColor: null },
  ];

  let li = 0;

  function typeText(el, text, cb) {
    let i = 0;
    const iv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(iv); if (cb) cb(); }
    }, 45);
  }

  function addLine() {
    if (li >= lines.length) { li = 0; setTimeout(clearAndRestart, 3000); return; }
    const data = lines[li++];

    const row = document.createElement('div');
    row.className = 'console-line';
    row.style.cssText = 'opacity:0; transition:opacity 0.3s';

    const promptEl = document.createElement('span');
    promptEl.className = 'console-prompt';
    promptEl.textContent = data.prompt;

    const cmdEl = document.createElement('span');
    cmdEl.className = 'console-output';

    row.appendChild(promptEl);
    row.appendChild(cmdEl);
    body.appendChild(row);
    requestAnimationFrame(() => { row.style.opacity = '1'; });

    typeText(cmdEl, data.text, () => {
      setTimeout(() => {
        if (data.output) {
          const outRow = document.createElement('div');
          outRow.style.cssText = 'opacity:0; transition:opacity 0.3s; padding-left:16px; font-family:monospace; font-size:0.85rem;';
          outRow.style.color = data.outColor || 'var(--text-muted)';
          outRow.innerHTML = data.output;
          body.appendChild(outRow);
          requestAnimationFrame(() => { outRow.style.opacity = '1'; });
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

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.glass-panel, .section-header');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity    = '1';
        e.target.style.transform  = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();

// ─── HERO TITLE TYPEWRITER ────────────────────────────────────────────────────
(function () {
  const el = document.getElementById('hero-title');
  if (!el) return;

  const text = 'Where Creativity\nMeets Skills.';
  const spanStart = 6;
  const spanEnd = 16;
  let i = 0;
  let gradientSpan = null;

  el.innerHTML = '<span class="typing-cursor">|</span>';

  function cursor() {
    return el.querySelector('.typing-cursor');
  }

  function addChar(ch) {
    if (ch === '\n') {
      el.insertBefore(document.createElement('br'), cursor());
      return;
    }
    const span = document.createElement('span');
    span.className = 'char-in';
    span.textContent = ch;
    el.insertBefore(span, cursor());
  }

  function type() {
    if (i >= text.length) return;

    const ch = text[i];

    if (i < spanStart) {
      addChar(ch);
    } else if (i < spanEnd) {
      if (!gradientSpan) {
        gradientSpan = document.createElement('span');
        gradientSpan.className = 'gradient-text char-in';
        gradientSpan.style.animation = 'fadeInUp 0.25s ease both, gradientShift 3s ease infinite';
        gradientSpan.textContent = '';
        el.insertBefore(gradientSpan, cursor());
      }
      gradientSpan.textContent += ch;
    } else if (i === spanEnd) {
      gradientSpan = null;
      addChar(ch);
    } else {
      addChar(ch);
    }

    i++;
    setTimeout(type, 70);
  }

  setTimeout(type, 800);
})();

// ─── LIKE WIDGET ──────────────────────────────────────────────────────────────
(function () {
  // views — only count if navigated here, not on refresh
  var viewsKey = 'kbjs_views';
  var views = parseInt(localStorage.getItem(viewsKey) || '0', 10);
  var navEntry = performance.getEntriesByType('navigation')[0];
  if (!navEntry || navEntry.type === 'navigate') {
    views++;
    localStorage.setItem(viewsKey, views.toString());
  }

  var key = 'kbjs_liked';
  var liked = localStorage.getItem(key) === 'true';

  var widget = document.createElement('div');
  widget.className = 'like-widget';

  var viewsEl = document.createElement('span');
  viewsEl.style.cssText = 'display:flex;align-items:center;gap:4px;color:var(--text-faint);font-size:0.75rem;';
  viewsEl.innerHTML = '👁 ' + views;

  var sep = document.createElement('span');
  sep.textContent = '·';
  sep.style.cssText = 'color:var(--text-faint);font-size:0.7rem;';

  var tooltip = document.createElement('div');
  tooltip.textContent = 'Your Like Makes It Amazing';
  tooltip.style.cssText = 'position:absolute;bottom:calc(100% + 8px);right:0;background:var(--bg-surface);color:var(--text-main);padding:8px 14px;border-radius:var(--radius-sm);font-size:0.72rem;font-family:var(--font-heading);white-space:nowrap;box-shadow:var(--shadow-md);border:1px solid var(--border-glass);opacity:0;pointer-events:none;transition:opacity 0.2s ease,transform 0.2s ease;transform:translateY(4px);';
  widget.appendChild(tooltip);

  var btn = document.createElement('button');
  btn.className = 'like-btn' + (liked ? ' liked' : '');
  btn.addEventListener('mouseenter', function () {
    if (!liked) { tooltip.style.opacity = '1'; tooltip.style.transform = 'translateY(0)'; }
  });
  btn.addEventListener('mouseleave', function () {
    tooltip.style.opacity = '0'; tooltip.style.transform = 'translateY(4px)';
  });

  var heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = liked ? '❤' : '♡';

  var countEl = document.createElement('span');
  countEl.className = 'like-count';
  countEl.textContent = '0';

  btn.appendChild(heart);
  btn.appendChild(countEl);
  widget.appendChild(viewsEl);
  widget.appendChild(sep);
  widget.appendChild(btn);
  document.body.appendChild(widget);

  function updateCount() {
    var raw = localStorage.getItem('kbjs_count');
    countEl.textContent = raw ? parseInt(raw, 10) : 0;
  }

  function saveCount(n) {
    localStorage.setItem('kbjs_count', n.toString());
    countEl.textContent = n;
  }

  btn.addEventListener('click', function (e) {
    if (liked) return;
    liked = true;
    localStorage.setItem(key, 'true');
    heart.textContent = '❤';
    btn.classList.add('liked');

    var current = parseInt(localStorage.getItem('kbjs_count') || '0', 10);
    saveCount(current + 1);

    localStorage.setItem('kbjs_like_event', Date.now().toString());

    // burst animation
    var colors = ['#5b4fff', '#00c2ff', '#ff4d94', '#00f2fe', '#ffbd2e', '#7f00ff'];
    for (var i = 0; i < 24; i++) {
      (function () {
        var p = document.createElement('div');
        var size = 4 + Math.random() * 8;
        var angle = Math.random() * Math.PI * 2;
        var dist = 60 + Math.random() * 120;
        var dx = Math.cos(angle) * dist;
        var dy = Math.sin(angle) * dist;
        var c = colors[Math.floor(Math.random() * colors.length)];
        p.style.cssText = 'position:fixed;left:' + (e.clientX || window.innerWidth / 2) + 'px;top:' + (e.clientY || window.innerHeight / 2) + 'px;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + c + ';pointer-events:none;z-index:9999;box-shadow:0 0 6px ' + c + ';transition:transform 0.8s cubic-bezier(.25,.46,.45,.94),opacity 0.8s ease;';
        document.body.appendChild(p);
        requestAnimationFrame(function () {
          p.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0)';
          p.style.opacity = '0';
        });
        setTimeout(function () { p.remove(); }, 900);
      })();
    }
  });

  window.addEventListener('storage', function (e) {
    if (e.key === 'kbjs_count') {
      countEl.textContent = e.newValue || '0';
    }
    if (e.key === 'kbjs_liked' && e.newValue === 'true') {
      liked = true;
      heart.textContent = '❤';
      btn.classList.add('liked');
    }
  });

  updateCount();
})();

// ─── TOAST UTILITY ────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s, transform 0.4s';
    toast.style.opacity    = '0';
    toast.style.transform  = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
(function () {
  const initTheme = () => {
    const savedTheme = localStorage.getItem('kbjs_theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  };
  initTheme();

  const registerToggle = () => {
    const btns = document.querySelectorAll('.theme-toggle-btn');
    btns.forEach(btn => {
      if (btn.dataset.themeBound) return;
      btn.dataset.themeBound = "true";

      btn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('kbjs_theme', isLight ? 'light' : 'dark');
        showToast(`Switched to ${isLight ? 'Light' : 'Dark'} Mode`, 'success');
      });
    });
  };

  registerToggle();
  window.addEventListener('DOMContentLoaded', registerToggle);
})();

// ─── CUSTOM CURSOR & SMOOTH TRAIL ──────────────────────────────────────────────
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let curX = 0, curY = 0;
  let ringX = 0, ringY = 0;
  let active = false;

  window.addEventListener('mousemove', e => {
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

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    active = false;
  });

  function updateCursor() {
    if (active) {
      ringX += (curX - ringX) * 0.15;
      ringY += (curY - ringY) * 0.15;

      dot.style.left = `${curX}px`;
      dot.style.top = `${curY}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  const hoverTargets = 'a, button, select, input, textarea, [role="button"], .glass-panel, .faq-question, .tier-card, .addon-item';
  
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (!e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });
})();

// ─── 3D CARD HOVER TILT ───────────────────────────────────────────────────────
(function () {
  const cards = document.querySelectorAll('.glass-panel');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      const rotateX = deltaY * -8;
      const rotateY = deltaX * 8;
      
      card.style.transition = 'none';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
})();

// ─── FAQ ACCORDION ─────────────────────────────────────────────────────────────
(function () {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = '0px';
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

// ─── CUSTOM CONFETTI ENGINE ────────────────────────────────────────────────────
window.triggerConfetti = function () {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#eab308', '#a855f7', '#06b6d4'];
  const particles = [];
  
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: W / 2,
      y: H / 2 - 50,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 15 - 5,
      r: Math.random() * 4 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    });
  }
  
  function animate() {
    let alive = false;
    ctx.clearRect(0, 0, W, H);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.01;
      
      if (p.alpha > 0 && p.y < H) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      }
    });
    
    if (alive) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }
  
  animate();
};


