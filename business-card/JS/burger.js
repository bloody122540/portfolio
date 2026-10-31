export default function initMenu() {
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".burger");

  nav.querySelectorAll("a").forEach(link => {
    const text = link.textContent.trim();
    link.dataset.text = text;
    link.innerHTML = `<span>${text}</span>`;

    link.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.classList.remove("open");
    });
  });

  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
    burger.classList.toggle("open");
  });
}
