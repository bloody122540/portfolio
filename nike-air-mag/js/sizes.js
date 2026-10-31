export const sizes = () => {
  const sizesList = document.querySelector(".product__sizes-list");
  const sizesButtons = document.querySelectorAll('[data-sizes="button"]');
  const cartSize = document.querySelector("[data-cart-size]");

  if (!sizesList) return;

  const handleSizeClick = (event) => {
    const target = event.target.closest('[data-sizes="button"]');

    if (!target) return;

    sizesButtons.forEach((button) => {
      button.classList.remove("product__sizes-button--active");
      button.setAttribute("aria-pressed", "false");
    });
    target.classList.add("product__sizes-button--active");
    target.setAttribute("aria-pressed", "true");

    if (cartSize) cartSize.textContent = target.textContent.trim();
  };

  sizesList.addEventListener("click", handleSizeClick);
};
