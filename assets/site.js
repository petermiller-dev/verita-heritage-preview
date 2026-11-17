/* Verita Heritage preview — progressive enhancement only.
   The site is fully usable without this file. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("reveal-fallback");

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    var label = toggle.querySelector(".nav-toggle__label");
    var desktop = window.matchMedia("(min-width: 761px)");
    var isOpen = false;

    toggle.hidden = false;

    var setOpen = function (open, restoreFocus) {
      isOpen = open;
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Close" : "Menu";
      root.classList.toggle("nav-open", open);
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      } else if (restoreFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", function () { setOpen(!isOpen, true); });

    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { setOpen(false, true); return; }
      if (e.key === "Tab") {
        // keep focus inside the open menu (toggle + links)
        var items = [toggle].concat(Array.prototype.slice.call(nav.querySelectorAll("a")));
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });

    nav.addEventListener("click", function (e) {
      if (isOpen && e.target.closest("a")) setOpen(false, false);
    });

    var onChange = function (e) { if (e.matches && isOpen) setOpen(false, false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- Scroll reveals & staggered tiles ---------- */
  var targets = document.querySelectorAll(".reveal, .stagger");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  Array.prototype.forEach.call(document.querySelectorAll(".stagger"), function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) { child.style.setProperty("--i", i); });
  });

  var showAll = function () {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("is-visible"); });
  };

  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

  Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
})();
