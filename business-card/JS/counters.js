export default function initCounters() {
  const section = document.querySelector(".counters");
  const numbers = document.querySelectorAll(".counter__number");

  const run = () => {
    numbers.forEach(el => {
      const target = +el.dataset.value;
      const duration = 1500;
      const start = performance.now();

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * progress);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  };

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      run();
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(section);
}
