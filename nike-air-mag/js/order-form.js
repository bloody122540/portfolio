export const orderForm = (modal) => {
  const form = document.querySelector("[data-order-form]");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    modal.openWindow("done");
  });
};
