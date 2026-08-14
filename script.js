(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* --- quick loader, nothing fancy --- */
  var loader = document.getElementById("loader");
  function hideLoader() {
    if (!loader) return;
    loader.classList.add("hidden");
    setTimeout(function () { loader.remove(); }, 400);
  }
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }
  setTimeout(hideLoader, 800);

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var header = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");
  var navLinks = document.querySelectorAll("[data-section]");
  var sections = [];

  navLinks.forEach(function (link) {
    var sec = document.getElementById(link.getAttribute("data-section"));
    if (sec) sections.push({ id: sec.id, el: sec });
  });

  /* one scroll handler instead of three — keeps things smooth */
  var scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;

      if (header) header.classList.toggle("scrolled", y > 12);
      if (backToTop) backToTop.classList.toggle("visible", y > 600);

      var pos = y + window.innerHeight * 0.35;
      var current = null;
      sections.forEach(function (s) {
        if (s.el.offsetTop <= pos) current = s.id;
      });
      navLinks.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("data-section") === current);
      });

      scrollTicking = false;
    });
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* mobile menu */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  var mobileBackdrop = document.getElementById("mobileBackdrop");

  function openMobileNav() {
    mobileNav.classList.add("open");
    mobileBackdrop.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    mobileNav.classList.remove("open");
    mobileBackdrop.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      open ? closeMobileNav() : openMobileNav();
    });
  }
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileNav);
  document.querySelectorAll("#mobileNav a").forEach(function (a) {
    a.addEventListener("click", closeMobileNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });

  /* typing line in the hero */
  var typingEl = document.getElementById("typingText");
  var phrases = ["Python Developer", "Front-End Developer", "Problem Solver", "Chess Player", "Student"];

  if (typingEl && !reduceMotion) {
    var pIndex = 0;
    var charIndex = phrases[0].length;
    var deleting = false;
    typingEl.textContent = phrases[0];

    function tick() {
      var current = phrases[pIndex];
      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
          charIndex = 0;
          setTimeout(tick, 350);
          return;
        }
      }
      typingEl.textContent = phrases[pIndex].slice(0, charIndex);
      setTimeout(tick, deleting ? 40 : 80);
    }
    setTimeout(tick, 1400);
  } else if (typingEl) {
    typingEl.textContent = phrases[0];
  }

  /* fade sections in as you scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* project cards — click to expand description */
  document.querySelectorAll("[data-project]").forEach(function (card) {
    var trigger = card.querySelector(".project-trigger");
    var panel = card.querySelector(".project-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      var open = card.classList.contains("is-open");

      document.querySelectorAll("[data-project].is-open").forEach(function (other) {
        if (other === card) return;
        other.classList.remove("is-open");
        var t = other.querySelector(".project-trigger");
        var p = other.querySelector(".project-panel");
        if (t) t.setAttribute("aria-expanded", "false");
        if (p) p.hidden = true;
      });

      card.classList.toggle("is-open", !open);
      trigger.setAttribute("aria-expanded", String(!open));
      trigger.setAttribute("data-cursor", open ? "View" : "Close");
      panel.hidden = open;
    });
  });

  /* toast helper */
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }

  var copyBtn = document.getElementById("copyEmailBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = "salupghimire10@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          showToast("Email copied");
        }).catch(function () {
          showToast(email);
        });
      } else {
        showToast(email);
      }
    });
  }

  /* contact form */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");
  var submitBtn = document.getElementById("contactSubmit");

  function setFieldError(id, message) {
    var input = document.getElementById(id);
    var errorEl = document.getElementById(id + "-error");
    if (!input || !errorEl) return;
    errorEl.textContent = message || "";
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateForm() {
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var message = document.getElementById("message");
    var valid = true;

    if (!name.value.trim()) {
      setFieldError("name", "Please enter your name.");
      valid = false;
    } else setFieldError("name", "");

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      setFieldError("email", "Please enter a valid email.");
      valid = false;
    } else setFieldError("email", "");

    if (!message.value.trim() || message.value.trim().length < 5) {
      setFieldError("message", "Message should be at least a few words.");
      valid = false;
    } else setFieldError("message", "");

    return valid;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm()) {
        formNote.textContent = "Please fix the highlighted fields.";
        formNote.classList.add("error");
        return;
      }

      formNote.classList.remove("error");
      formNote.textContent = "Sending...";
      submitBtn.disabled = true;

      var action = form.getAttribute("action").replace("formsubmit.co/", "formsubmit.co/ajax/");
      fetch(action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("fail");
          return res.json();
        })
        .then(function () {
          formNote.textContent = "Message sent — I'll get back to you soon.";
          form.reset();
        })
        .catch(function () {
          formNote.textContent = "Submitting...";
          form.submit();
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  /* custom cursor — magnetic, labeled, only runs on desktop with a mouse */
  if (finePointer && !reduceMotion) {
    var body = document.body;
    var dot = document.getElementById("cursor-dot");
    var ring = document.getElementById("cursor-ring");
    var label = document.getElementById("cursor-label");

    var mouseX = -100, mouseY = -100;   // raw mouse position
    var targetX = -100, targetY = -100; // pull-adjusted target (mouse, or magnetized toward a target element)
    var dotX = -100, dotY = -100;
    var ringX = -100, ringY = -100;

    var visible = false;
    var animating = false;
    var magnetEl = null; // element currently exerting magnetic pull

    var MAGNET_STRENGTH = 0.4;   // how strongly the cursor snaps toward a magnet target
    var DOT_LERP = 0.35;         // dot smoothing (fast, still feels responsive)
    var RING_LERP = 0.14;        // ring smoothing (slower, trailing)

    body.classList.add("has-custom-cursor");

    function setVisible(show) {
      visible = show;
      body.classList.toggle("is-cursor-visible", show);
    }

    function recomputeTarget() {
      if (magnetEl) {
        var rect = magnetEl.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        targetX = mouseX + (cx - mouseX) * MAGNET_STRENGTH;
        targetY = mouseY + (cy - mouseY) * MAGNET_STRENGTH;
      } else {
        targetX = mouseX;
        targetY = mouseY;
      }
    }

    function animate() {
      dotX += (targetX - dotX) * DOT_LERP;
      dotY += (targetY - dotY) * DOT_LERP;
      ringX += (targetX - ringX) * RING_LERP;
      ringY += (targetY - ringY) * RING_LERP;

      if (dot) dot.style.transform = "translate(" + dotX + "px," + dotY + "px) translate(-50%,-50%)";
      if (ring) ring.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
      if (label) label.style.transform = "translate(" + ringX + "px," + (ringY + 40) + "px) translate(-50%,-50%)";

      var settled = Math.abs(targetX - dotX) < 0.4 && Math.abs(targetY - dotY) < 0.4 &&
        Math.abs(targetX - ringX) < 0.4 && Math.abs(targetY - ringY) < 0.4;

      if (visible || !settled) {
        requestAnimationFrame(animate);
      } else {
        animating = false;
      }
    }

    function startLoop() {
      if (!animating) {
        animating = true;
        requestAnimationFrame(animate);
      }
    }

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);
      recomputeTarget();
      startLoop();
    }, { passive: true });

    window.addEventListener("mouseleave", function () { setVisible(false); });
    window.addEventListener("mouseenter", function () { setVisible(true); });

    window.addEventListener("mousedown", function (e) {
      dot && dot.classList.add("is-click");
      ring && ring.classList.add("is-click");

      var ripple = document.createElement("span");
      ripple.className = "cursor-ripple";
      ripple.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px) translate(-50%,-50%)";
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", function () { ripple.remove(); });
    });
    window.addEventListener("mouseup", function () {
      dot && dot.classList.remove("is-click");
      ring && ring.classList.remove("is-click");
    });

    function showLabel(text) {
      if (!label) return;
      label.textContent = text;
      label.classList.add("show");
      ring && ring.classList.add("is-label");
    }
    function hideLabel() {
      if (!label) return;
      label.classList.remove("show");
      ring && ring.classList.remove("is-label");
    }

    var magnetSelector = ".btn, .social-icon-link, .hero-social a, .footer-social a, .contact-card, .profile-icons a, .back-to-top, .logo";

    document.querySelectorAll("a, button, input, textarea, .project-trigger").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        dot && dot.classList.add("is-hover");
        ring && ring.classList.add("is-hover");

        if (el.matches(magnetSelector)) {
          magnetEl = el;
        }
        var cursorText = el.getAttribute("data-cursor");
        if (cursorText) showLabel(cursorText);
      });
      el.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        recomputeTarget();
      });
      el.addEventListener("mouseleave", function () {
        dot && dot.classList.remove("is-hover");
        ring && ring.classList.remove("is-hover");
        if (magnetEl === el) magnetEl = null;
        hideLabel();
      });
    });
  }

  /* anchor links — offset for the fixed header */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      history.pushState(null, "", id);
    });
  });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* live chess.com rapid rating — fails silently if the API is unreachable */
  var ratingBadge = document.getElementById("chessRatingBadge");
  var ratingValue = document.getElementById("chessRating");
  if (ratingBadge && ratingValue && "fetch" in window) {
    fetch("https://api.chess.com/pub/player/salup_ghimire/stats")
      .then(function (res) {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then(function (data) {
        var rapid = data && data.chess_rapid && data.chess_rapid.last;
        if (rapid && rapid.rating) {
          ratingValue.textContent = rapid.rating;
          ratingBadge.hidden = false;
        }
      })
      .catch(function () {
        /* keep the badge hidden — no rating to show */
      });
  }
})();
