(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Sticky nav state */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
  var burger = document.querySelector(".nav-burger");
  var menu = document.getElementById("mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Downloads & more floating window */
  var moreToggle = document.getElementById("more-window-toggle");
  var moreWindow = document.getElementById("more-window");
  var moreClose = document.getElementById("more-window-close");
  if (moreToggle && moreWindow) {
    var setMoreOpen = function (open) {
      moreWindow.classList.toggle("open", open);
      moreToggle.setAttribute("aria-expanded", open ? "true" : "false");
      moreWindow.setAttribute("aria-hidden", open ? "false" : "true");
    };
    moreToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setMoreOpen(!moreWindow.classList.contains("open"));
    });
    if (moreClose) {
      moreClose.addEventListener("click", function () { setMoreOpen(false); });
    }
    /* Click anywhere outside the window closes it */
    document.addEventListener("click", function (e) {
      if (!moreWindow.classList.contains("open")) return;
      if (!moreWindow.contains(e.target) && !moreToggle.contains(e.target)) setMoreOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !moreWindow.classList.contains("open")) return;
      setMoreOpen(false);
      if (moreWindow.contains(document.activeElement)) moreToggle.focus();
    });
  }

  /* Tabs (hero command box + process) */
  Array.prototype.forEach.call(document.querySelectorAll("[role=tablist]"), function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role=tab]"));
    if (!tabs.length) return;

    var panels = tabs.map(function (t) {
      return document.getElementById(t.getAttribute("aria-controls"));
    });

    function select(index, focus) {
      tabs.forEach(function (t, i) {
        t.setAttribute("aria-selected", i === index ? "true" : "false");
        t.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach(function (p, i) {
        if (p) p.hidden = i !== index;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i); });
      tab.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = (i + d + tabs.length) % tabs.length;
        select(next, true);
      });
    });
  });

  /* Copy buttons */
  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      function done() {
        btn.classList.add("copied");
        window.setTimeout(function () { btn.classList.remove("copied"); }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(); });
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* Rotating hero keyword */
  var words = Array.prototype.slice.call(document.querySelectorAll(".rot-word"));
  if (words.length > 1 && !reduced) {
    var current = 0;
    window.setInterval(function () {
      words[current].classList.remove("active");
      current = (current + 1) % words.length;
      words[current].classList.add("active");
    }, 3000);
  }

  /* Reveal on scroll */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    var vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        el.classList.add("in"); /* already on screen — show without waiting */
      } else {
        io.observe(el);
      }
    });
  }

  /* Portfolio filters */
  var filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    var filterBtns = Array.prototype.slice.call(filterBar.querySelectorAll("[data-filter]"));
    var filterItems = Array.prototype.slice.call(
      document.querySelectorAll(filterBar.getAttribute("data-target") || ".gallery-item")
    );
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-filter]") : null;
      if (!btn) return;
      var value = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      filterItems.forEach(function (item) {
        var cats = (item.getAttribute("data-cats") || "").split(/\s+/);
        item.hidden = !(value === "all" || cats.indexOf(value) !== -1);
      });
    });
  }

  /* Cursor ambience — a soft azure glow follows the cursor across layout
     panels only (matches the Azure Aura cursor set; styling in kbjs-theme.css). */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced) {
    Array.prototype.forEach.call(
      document.querySelectorAll(
        ".cmd-box, .process-panel, .cta-panel, .footer-card, .card, .work-card, .gallery-item, .faq-item"
      ),
      function (panel) {
        if (getComputedStyle(panel).position === "static") panel.style.position = "relative";
        panel.classList.add("has-ambient");

        var layer = document.createElement("span");
        layer.className = "cursor-ambient";
        layer.setAttribute("aria-hidden", "true");
        panel.appendChild(layer);

        panel.addEventListener("pointermove", function (e) {
          var r = panel.getBoundingClientRect();
          layer.style.setProperty("--amb-x", (e.clientX - r.left).toFixed(1) + "px");
          layer.style.setProperty("--amb-y", (e.clientY - r.top).toFixed(1) + "px");
        }, { passive: true });
        panel.addEventListener("pointerenter", function () {
          panel.classList.add("ambient-on");
        }, { passive: true });
        panel.addEventListener("pointerleave", function () {
          panel.classList.remove("ambient-on");
        });
      }
    );
  }

})();