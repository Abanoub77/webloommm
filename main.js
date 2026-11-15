/* ==========================================================================
   WEBLOOM — Digital Studio
   main.js — navigation, reveals, counters, filters, pricing, form
   ========================================================================== */
(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const whatsappNumber = document.body.dataset.whatsapp || "201226866365";

  /* Keep every WhatsApp link in sync with the number set on <body> */
  if (whatsappNumber) {
    $$('a[href*="wa.me/"]').forEach((link) => {
      link.href = link.href.replace(/wa\.me\/\d+/, `wa.me/${whatsappNumber}`);
    });
  }

  /* ---------- Header, scroll progress & active nav ---------- */
  const header = $("#siteHeader");
  const progressBar = $(".scroll-progress span");
  const navLinks = $$(".nav-desktop a");
  const navSections = navLinks
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  let scrollTicking = false;

  const updateOnScroll = () => {
    const y = window.scrollY;

    header.classList.toggle("scrolled", y > 10);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) {
      progressBar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }

    const marker = y + 150;
    let currentId = "";
    navSections.forEach((section) => {
      if (section.offsetTop <= marker) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
    });

    scrollTicking = false;
  };

  const requestScrollUpdate = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(updateOnScroll);
    }
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  updateOnScroll();

  /* ---------- Mobile menu ---------- */
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  const openMenu = () => {
    document.body.classList.add("nav-open");
    header.classList.add("menu-open");
    mobileMenu.inert = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    const firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus({ preventScroll: true });
  };
  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    header.classList.remove("menu-open");
    mobileMenu.inert = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      if (document.body.classList.contains("nav-open")) closeMenu();
      else openMenu();
    });

    $$("a", mobileMenu).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980 && document.body.classList.contains("nav-open")) {
        closeMenu();
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const target = Number.parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion || target === 0) {
      el.textContent = target.toLocaleString("en-US");
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Portfolio filtering ---------- */
  const filterButtons = $$(".filter");
  const projectCards = $$(".project-card");
  const projectCount = $("#workCount");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      let visible = 0;
      projectCards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.hidden = !show;
        if (show) {
          visible += 1;
          card.classList.add("in");
          card.classList.remove("appear");
          void card.offsetWidth;
          card.classList.add("appear");
        }
      });

      if (projectCount) {
        projectCount.textContent = `${String(visible).padStart(2, "0")} project${visible === 1 ? "" : "s"}`;
      }
    });
  });

  /* ---------- Pricing billing toggle ---------- */
  const billingButtons = $$("[data-billing]");
  const priceAmounts = $$(".amount");
  const pricePeriods = $$("[data-period]");
  const billingNote = $("#billingNote");

  const setBilling = (mode) => {
    billingButtons.forEach((btn) => {
      const isActive = btn.dataset.billing === mode;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    priceAmounts.forEach((amount) => {
      const next = mode === "monthly" ? amount.dataset.monthly : amount.dataset.onetime;
      if (!next) return;
      amount.classList.add("is-changing");
      const swap = () => {
        amount.textContent = next;
        amount.classList.remove("is-changing");
      };
      if (reduceMotion) swap();
      else window.setTimeout(swap, 150);
    });

    pricePeriods.forEach((period) => {
      period.textContent = mode === "monthly" ? "/ month" : "/ project";
    });

    if (billingNote) {
      billingNote.textContent =
        mode === "monthly"
          ? "Flexible monthly retainer"
          : "One-time project fee · no lock-in";
    }
  };

  billingButtons.forEach((button) => {
    button.addEventListener("click", () => setBilling(button.dataset.billing));
  });

  /* Pre-fill the contact form when a plan is chosen */
  const budgetSelect = $("#budget");
  const messageField = $("#message");
  const planBudgets = {
    Launch: "4,000 – 7,000 EGP",
    Scale: "7,000 – 10,000 EGP",
    Partner: "10,000+ EGP"
  };

  $$(".plan-cta").forEach((link) => {
    link.addEventListener("click", () => {
      const plan = link.dataset.plan;
      if (budgetSelect && planBudgets[plan]) budgetSelect.value = planBudgets[plan];
      if (messageField && !messageField.value.trim()) {
        messageField.value = `Hi WEBLOOM — I'm interested in the ${plan} plan. Here's a little about my project: `;
      }
    });
  });

  /* ---------- Cursor spotlight ---------- */
  if (canHover && !reduceMotion) {
    $$(".spotlight").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });

    const hero = $(".hero");
    if (hero) {
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        hero.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    }
  }

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  if (form) {
    const successPanel = $("#formSuccess");
    const successTitle = $("#successTitle");
    const successWhatsApp = $("#successWhatsApp");

    const fields = {
      name: {
        input: $("#name"),
        error: $("#nameError"),
        validate: (value) =>
          value.trim().length >= 2 ? "" : "Please enter your name."
      },
      email: {
        input: $("#email"),
        error: $("#emailError"),
        validate: (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
            ? ""
            : "Enter a valid email address."
      },
      message: {
        input: $("#message"),
        error: $("#messageError"),
        validate: (value) =>
          value.trim().length >= 10
            ? ""
            : "Tell us a little more (at least 10 characters)."
      }
    };

    const setFieldState = (field, message) => {
      const wrapper = field.input.closest(".field");
      wrapper.classList.toggle("is-invalid", Boolean(message));
      field.input.setAttribute("aria-invalid", message ? "true" : "false");
      if (field.error) field.error.textContent = message;
    };

    Object.values(fields).forEach((field) => {
      field.input.addEventListener("input", () => {
        if (field.input.closest(".field").classList.contains("is-invalid")) {
          setFieldState(field, field.validate(field.input.value));
        }
      });
    });

    const openWhatsApp = (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let firstInvalid = null;
      Object.values(fields).forEach((field) => {
        const message = field.validate(field.input.value);
        setFieldState(field, message);
        if (message && !firstInvalid) firstInvalid = field.input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const company = String(data.get("company") || "").trim();
      const budget = String(data.get("budget") || "").trim();
      const message = String(data.get("message") || "").trim();

      const lines = [`Hi WEBLOOM — I'm ${name}.`, "", `Email: ${email}`];
      if (company) lines.push(`Company: ${company}`);
      if (budget) lines.push(`Budget: ${budget}`);
      lines.push("", `Project: ${message}`);

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;

      if (successTitle) {
        const firstName = name.split(/\s+/)[0];
        successTitle.textContent = `Thanks, ${firstName} — message ready.`;
      }
      if (successWhatsApp) successWhatsApp.href = url;

      form.hidden = true;
      if (successPanel) {
        successPanel.hidden = false;
        successPanel.focus({ preventScroll: true });
        successPanel.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center"
        });
      }

      openWhatsApp(url);
    });

    const sendAnother = $("#sendAnother");
    if (sendAnother) {
      sendAnother.addEventListener("click", () => {
        form.reset();
        Object.values(fields).forEach((field) => setFieldState(field, ""));
        if (successPanel) successPanel.hidden = true;
        form.hidden = false;
        const firstName = $("#name");
        if (firstName) firstName.focus();
      });
    }
  }

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
