export default class HeaderFixed {
  constructor(config) {
    this.headerTypes = config;
    this.header = document.querySelector(`.${this.headerTypes.HEADER}`);

    if (!this.header) {
      throw new Error("Header element is missing.");
    }

    this.initEvents();
    this.updateFixedClass();
  }

  initEvents() {
    window.addEventListener("scroll", this.updateFixedClass.bind(this), { passive: true });
  }

  updateFixedClass() {
    this.header.classList.toggle(this.headerTypes.HEADER_FIXED, window.scrollY > 0);
  }

  removeFixedClass() {
    this.header.classList.remove(this.headerTypes.HEADER_FIXED);
  }
}
