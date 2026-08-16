const root = document.documentElement;
root.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const slider = document.querySelector("[data-slider]");

if (slider) {
  const track = slider.querySelector("[data-slider-track]");
  const slides = Array.from(track.children);
  const dotsContainer = document.querySelector("[data-slider-dots]");
  const previousButton = document.querySelector("[data-slider-prev]");
  const nextButton = document.querySelector("[data-slider-next]");
  let currentIndex = 0;
  let autoplayTimer;
  let pointerStartX = 0;

  const dots = slides.map((slide, index) => {
    slide.setAttribute("aria-hidden", index === 0 ? "false" : "true");
    slide.setAttribute("aria-label", `Projekt ${index + 1} von ${slides.length}`);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `slider-dot${index === 0 ? " is-active" : ""}`;
    dot.setAttribute("aria-label", `Projekt ${index + 1} anzeigen`);
    dot.setAttribute("aria-current", index === 0 ? "true" : "false");
    dot.addEventListener("click", () => selectSlide(index, true));
    dotsContainer.appendChild(dot);
    return dot;
  });

  const stopAutoplay = () => window.clearInterval(autoplayTimer);

  const startAutoplay = () => {
    stopAutoplay();
    if (!reduceMotion && !document.hidden) {
      autoplayTimer = window.setInterval(() => selectSlide(currentIndex + 1), 4300);
    }
  };

  function selectSlide(index, wasRequested = false) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
    slides.forEach((slide, slideIndex) => {
      const isCurrent = slideIndex === currentIndex;
      slide.classList.toggle("is-active", isCurrent);
      slide.setAttribute("aria-hidden", isCurrent ? "false" : "true");
      dots[slideIndex].classList.toggle("is-active", isCurrent);
      dots[slideIndex].setAttribute("aria-current", isCurrent ? "true" : "false");
    });

    if (wasRequested) startAutoplay();
  }

  previousButton.addEventListener("click", () => selectSlide(currentIndex - 1, true));
  nextButton.addEventListener("click", () => selectSlide(currentIndex + 1, true));

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") selectSlide(currentIndex - 1, true);
    if (event.key === "ArrowRight") selectSlide(currentIndex + 1, true);
  });

  slider.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
    stopAutoplay();
  });

  slider.addEventListener("pointerup", (event) => {
    const distance = event.clientX - pointerStartX;
    if (Math.abs(distance) > 36) {
      selectSlide(currentIndex + (distance < 0 ? 1 : -1), true);
    } else {
      startAutoplay();
    }
  });

  const stage = slider.closest(".device-stage");
  stage.addEventListener("mouseenter", stopAutoplay);
  stage.addEventListener("mouseleave", startAutoplay);
  stage.addEventListener("focusin", stopAutoplay);
  stage.addEventListener("focusout", startAutoplay);
  document.addEventListener("visibilitychange", () => document.hidden ? stopAutoplay() : startAutoplay());

  startAutoplay();
}

const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {
  const front = card.querySelector(".service-front");
  const back = card.querySelector(".service-back");
  const serviceName = front.querySelector("h3").textContent;

  const setFlipped = (isFlipped) => {
    card.classList.toggle("is-flipped", isFlipped);
    card.setAttribute("aria-pressed", isFlipped ? "true" : "false");
    card.setAttribute("aria-label", `${isFlipped ? "Beschreibung" : "Beispiel"} für ${serviceName} anzeigen`);
    front.setAttribute("aria-hidden", isFlipped ? "true" : "false");
    back.setAttribute("aria-hidden", isFlipped ? "false" : "true");
  };

  setFlipped(false);

  card.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "mouse") {
      setFlipped(!card.classList.contains("is-flipped"));
    }
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setFlipped(!card.classList.contains("is-flipped"));
    }
  });

  card.addEventListener("blur", () => setFlipped(false));
});

if (!reduceMotion) {
  const revealGroups = [
    ".hero-visual",
    ".section-heading > *",
    ".service-card",
    ".studio-strip > div",
    ".studio-points p",
    ".portrait",
    ".about > div:last-child > *",
    ".process > .eyebrow",
    ".process > h2",
    ".process-intro > *",
    ".steps li",
    ".contact > .eyebrow",
    ".contact > h2",
    ".contact > p",
    ".contact form",
    ".contact .small"
  ];

  const revealItems = document.querySelectorAll(revealGroups.join(","));
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.18
  });

  revealItems.forEach((item) => observer.observe(item));

  const updateScrollState = () => {
    const hero = document.querySelector(".hero");
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
    const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
    root.style.setProperty("--hero-progress", progress.toFixed(3));
    root.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  let ticking = false;
  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateScrollState();
      ticking = false;
    });
  };

  updateScrollState();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
} else {
  root.classList.add("reduced-motion");
}
