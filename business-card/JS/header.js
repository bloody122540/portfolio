export default function initHeader() {
  const header = document.querySelector(".header");

  const check = () => header.classList.toggle("scrolled", window.scrollY > 20);
  check();
  window.addEventListener("scroll", check);
}
