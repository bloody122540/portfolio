export default function initPopup() {
  const popup = document.querySelector(".popup");
  const logo = document.querySelector(".logo");
  const closeBtn = popup.querySelector(".popup__close");

  const open = e => {
    e.preventDefault();
    popup.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => popup.classList.add("open"));
  };

  const close = () => {
    popup.classList.remove("open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => popup.hidden = true, 350);
  };

  logo.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  popup.addEventListener("click", e => {
    if (e.target === popup) close();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !popup.hidden) close();
  });
}
