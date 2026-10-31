export default function initCardTilt() {
  if (window.matchMedia("(hover: none)").matches) return;

  const maxAngle = 12;

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      card.classList.add("tilting");
      card.style.transform =
        `perspective(1000px) rotateX(${(0.5 - y) * maxAngle * 2}deg) rotateY(${(x - 0.5) * maxAngle * 2}deg)`;

      card.style.setProperty("--x", `${x * 100}%`);
      card.style.setProperty("--y", `${y * 100}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("tilting");
      card.style.transform = "";
    });
  });
}
