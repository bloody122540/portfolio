export default class Modal {
  constructor(config) {
    const defaultConfig = {
      MODAL_WRAPPER: "modal",
    };
    this.config = Object.assign(defaultConfig, config);
    this.modal = document.querySelector(`.${this.config.MODAL_WRAPPER}`);
    this.body = document.querySelector(`.${this.config.PAGE_BODY}`);
    this.speed = 0;
    this.isOpen = false;
    this.modalWindow = null;
    this.lastActiveElement = null;
    this.focusElements = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select",
      "textarea",
      "[tabindex]:not([tabindex='-1'])",
    ];

    if (!this.modal) {
      throw new Error("Modal element is missing.");
    }

    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onModalClick = this.onModalClick.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.enableScroll = this.enableScroll.bind(this);
    this.disableScroll = this.disableScroll.bind(this);
    this.catchFocus = this.catchFocus.bind(this);
    this.trapFocus = this.trapFocus.bind(this);

    this.initEvents();
  }

  initEvents() {
    document.addEventListener("click", this.onDocumentClick);
    window.addEventListener("keydown", this.onKeyDown);
    this.modal.addEventListener("click", this.onModalClick);
  }

  onDocumentClick(event) {
    const targetButton = event.target.closest("[data-modal-button]");

    if (targetButton) {
      event.preventDefault();
      const speed = targetButton.dataset.modalSpeed;

      if (!this.isOpen) this.lastActiveElement = document.activeElement;
      this.speed = speed ? parseInt(speed, 10) : 300;

      return this.openWindow(targetButton.dataset.modalButton);
    }

    const targetClose = event.target.closest("[data-modal-close]");

    if (targetClose) {
      return this.close();
    }
  }

  onKeyDown(event) {
    if (event.key === "Escape" && this.isOpen) {
      this.close();
    }

    if (event.key === "Tab" && this.isOpen) {
      return this.catchFocus(event);
    }
  }

  onModalClick(event) {
    const target = event.target;

    if (!target.closest("[data-modal-window]") && this.isOpen) {
      this.close();
    }
  }

  openWindow(name) {
    const modalWindow = document.querySelector(`[data-modal-window="${name}"]`);

    if (!modalWindow) {
      console.warn(`Modal window "${name}" not found.`);
      return;
    }

    if (this.modalWindow && this.modalWindow !== modalWindow) {
      this.modalWindow.classList.remove("modal__window--open");
    }

    if (!this.isOpen) this.lastActiveElement = this.lastActiveElement || document.activeElement;
    this.modalWindow = modalWindow;
    this.open();
  }

  open() {
    this.modal.style.setProperty("--transition-time", `${this.speed / 1000}s`);
    this.modal.classList.add("modal--open");
    this.modalWindow.classList.add("modal__window--open");

    this.isOpen = true;
    this.disableScroll();

    setTimeout(() => {
      if (this.isOpen) this.trapFocus();
    }, Math.max(this.speed - 16, 0));
  }

  close() {
    if (!this.isOpen) return;

    this.modal.classList.remove("modal--open");
    this.modalWindow.classList.remove("modal__window--open");

    this.isOpen = false;
    this.enableScroll();
    this.trapFocus();
    this.lastActiveElement = null;
  }

  enableScroll() {
    this.body.classList.remove(this.config.PAGE_BODY_NO_SCROLL);
  }

  disableScroll() {
    this.body.classList.add(this.config.PAGE_BODY_NO_SCROLL);
  }

  catchFocus(event) {
    const focusableElements = this.modalWindow.querySelectorAll(
      this.focusElements
    );
    const focusArray = Array.prototype.slice.call(focusableElements);
    const focusIndex = focusArray.indexOf(document.activeElement);

    if (event.shiftKey && focusIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      event.preventDefault();
    }

    if (!event.shiftKey && focusIndex === focusArray.length - 1) {
      focusArray[0].focus();
      event.preventDefault();
    }
  }

  trapFocus() {
    const focusableElements = this.modalWindow.querySelectorAll(
      this.focusElements
    );

    if (this.isOpen) {
      if (focusableElements.length) focusableElements[0].focus();
    } else if (this.lastActiveElement) {
      this.lastActiveElement.focus();
    }
  }
}
