const root = document.documentElement;
root.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  const revealGroups = [
    ".hero-copy > *",
    ".hero-visual",
    ".section-heading > *",
    ".service-card",
    ".studio-strip > div",
    ".studio-points p",
    ".portrait",
    ".about > div:last-child > *",
    ".instagram-copy > *",
    ".insta-post",
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
