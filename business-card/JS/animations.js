export default function initFadeIn() {
  const items = document.querySelectorAll(
    ".section-title, .about__text p, .about .card, .counter, .portfolio-slider, .portfolio-more, .price-card, .socials"
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  items.forEach(item => {
    item.classList.add("fade");
    observer.observe(item);
  });
}
