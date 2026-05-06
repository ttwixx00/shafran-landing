const luxuryEasePath = "M0,0 C0.25,1 0.5,1 1,1";
const hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function splitHeroTitle() {
  const title = document.querySelector("[data-split]");

  if (!title || title.dataset.ready === "true") {
    return;
  }

  const words = title.textContent.trim().split(/\s+/);
  title.innerHTML = words
    .map((word) => `<span class="word-mask"><span class="split-word">${word}</span></span>`)
    .join(" ");
  title.dataset.ready = "true";
}

function initMobileMenu() {
  const header = document.querySelector(".site-header");
  const button = document.querySelector(".mobile-menu");
  const panel = document.querySelector(".mobile-panel");
  const links = panel?.querySelectorAll("a") || [];

  if (!header || !button || !panel) {
    return;
  }

  const closeMenu = () => {
    header.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  };

  button.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));
}

function initHeaderState() {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initImageFallbacks() {
  document.querySelectorAll("img").forEach((image) => {
    if (image.complete && image.naturalWidth === 0) {
      image.classList.add("is-missing");
    }

    image.addEventListener("error", () => {
      image.classList.add("is-missing");
    });
  });
}

function initLenis() {
  if (hasReducedMotion || !window.Lenis || !window.gsap || !window.ScrollTrigger) {
    return null;
  }

  const lenis = new window.Lenis({
    duration: 1.35,
    smoothWheel: true,
    wheelMultiplier: 0.82,
    touchMultiplier: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });

  lenis.on("scroll", window.ScrollTrigger.update);

  window.gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  window.gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger || hasReducedMotion) {
    document.querySelector(".hero-section")?.style.setProperty("opacity", "1");
    document.querySelector(".hero-phone-list")?.style.setProperty("opacity", "1");
    return;
  }

  const { gsap, ScrollTrigger, CustomEase } = window;
  gsap.registerPlugin(ScrollTrigger);

  if (CustomEase) {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("luxury", luxuryEasePath);
  }

  const ease = CustomEase ? "luxury" : "power4.out";

  gsap.set(".hero-image", { scale: 1.05 });
  gsap.set(".split-word", { yPercent: 110 });

  const heroTimeline = gsap.timeline({ defaults: { ease } });

  heroTimeline
    .to(".hero-section", { opacity: 1, duration: 1.05 })
    .to(".hero-image", { scale: 1, duration: 4.8, ease }, 0)
    .to(".hero-kicker", { opacity: 1, y: 0, duration: 0.9 }, 0.25)
    .to(".split-word", { yPercent: 0, duration: 1.05, stagger: 0.08 }, 0.45)
    .to(".hero-copy", { opacity: 1, y: 0, duration: 0.95 }, 0.9)
    .to(".hero-section .primary-button, .hero-phone-list", { opacity: 1, y: 0, duration: 0.95 }, 1.05);

  gsap.fromTo(
    ".about-copy",
    { opacity: 0, x: -42 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease,
      scrollTrigger: {
        trigger: ".about-copy",
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    },
  );

  gsap.to(".image-reveal", {
    clipPath: "inset(0 0% 0 0)",
    duration: 1.12,
    ease,
    scrollTrigger: {
      trigger: ".image-reveal",
      start: "top 78%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.to(".about-image .parallax-image", {
    yPercent: -12,
    ease: "none",
    scrollTrigger: {
      trigger: ".about-image",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(".room-card", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease,
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".room-grid",
      start: "top 76%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.to(".service-item", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease,
    stagger: 0.12,
    scrollTrigger: {
      trigger: ".services-grid",
      start: "top 78%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.to(".gallery-item", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease,
    stagger: 0.13,
    scrollTrigger: {
      trigger: ".gallery-grid",
      start: "top 78%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.to(".cta-bg", {
    yPercent: -13,
    ease: "none",
    scrollTrigger: {
      trigger: ".cta-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(".site-footer", {
    opacity: 1,
    duration: 1,
    ease,
    scrollTrigger: {
      trigger: ".site-footer",
      start: "top 86%",
      toggleActions: "play none none reverse",
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  splitHeroTitle();
  initMobileMenu();
  initHeaderState();
  initIcons();
  initImageFallbacks();
  initLenis();
  initAnimations();
});
