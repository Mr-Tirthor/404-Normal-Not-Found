const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".carousel-dot"));
const carousel = document.querySelector(".carousel");
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const sidebarScrim = document.querySelector(".sidebar-scrim");
const supportDialog = document.querySelector(".support-dialog");
const supportLoadingDialog = document.querySelector(".support-loading-dialog");
const helpLink = document.querySelector(".topbar-help");
const helpDialog = document.querySelector(".help-dialog");
const helpDialogAction = document.querySelector(".help-dialog-action");
const bottomSupportCard = document.querySelector("#support-bottom");
let activeSlide = 0;
let carouselTimer;
let supportTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
    slide.toggleAttribute("inert", !isActive);
    dots[slideIndex].classList.toggle("is-active", isActive);

    if (isActive) {
      dots[slideIndex].setAttribute("aria-current", "true");
    } else {
      dots[slideIndex].removeAttribute("aria-current");
    }
  });
}

function startCarousel() {
  window.clearInterval(carouselTimer);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 6500);
  }
}

document.querySelector(".carousel-arrow.previous").addEventListener("click", () => {
  showSlide(activeSlide - 1);
  startCarousel();
});

document.querySelector(".carousel-arrow.next").addEventListener("click", () => {
  showSlide(activeSlide + 1);
  startCarousel();
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    startCarousel();
  });
});

carousel.addEventListener("mouseenter", () => window.clearInterval(carouselTimer));
carousel.addEventListener("mouseleave", startCarousel);
carousel.addEventListener("focusin", () => window.clearInterval(carouselTimer));
carousel.addEventListener("focusout", (event) => {
  if (!carousel.contains(event.relatedTarget)) startCarousel();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) window.clearInterval(carouselTimer);
  else startCarousel();
});

function setMenuOpen(isOpen) {
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".intro-copy, .carousel, .service-card, .assurance").forEach((element) => {
    element.classList.add("reveal-ready");
    revealObserver.observe(element);
  });
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

sidebarScrim.addEventListener("click", () => setMenuOpen(false));
sidebar.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

function showSupportNotice(event) {
  event.preventDefault();
  window.clearTimeout(supportTimer);
  supportLoadingDialog.showModal();

  supportTimer = window.setTimeout(() => {
    supportLoadingDialog.close();
    supportDialog.showModal();
  }, 3500);
}

document.querySelectorAll(".assurance-link, .service-card-cta, .sidebar-bottom .nav-link").forEach((link) => {
  link.addEventListener("click", showSupportNotice);
});

supportDialog.querySelectorAll(".support-dialog-close, .support-dialog-dismiss").forEach((button) => {
  button.addEventListener("click", () => supportDialog.close());
});

supportDialog.addEventListener("click", (event) => {
  if (event.target === supportDialog) supportDialog.close();
});

supportLoadingDialog.querySelector(".support-dialog-close").addEventListener("click", () => supportLoadingDialog.close());
supportLoadingDialog.addEventListener("click", (event) => {
  if (event.target === supportLoadingDialog) supportLoadingDialog.close();
});
supportLoadingDialog.addEventListener("close", () => window.clearTimeout(supportTimer));
supportDialog.addEventListener("close", () => window.clearTimeout(supportTimer));

helpLink.addEventListener("click", (event) => {
  event.preventDefault();
  helpDialog.showModal();
});

helpDialog.querySelector(".support-dialog-close").addEventListener("click", () => helpDialog.close());
helpDialog.addEventListener("click", (event) => {
  if (event.target === helpDialog) helpDialog.close();
});
helpDialogAction.addEventListener("click", () => {
  helpDialog.close();
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  bottomSupportCard.scrollIntoView({ behavior, block: "center" });
  bottomSupportCard.focus({ preventScroll: true });
});

startCarousel();