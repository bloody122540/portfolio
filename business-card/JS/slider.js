export default function initSlider() {
  if (typeof Swiper === "undefined") return;

  new Swiper(".portfolio-slider", {
    loop: true,
    grabCursor: true,
    speed: 600,

    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 14,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      480: {
        slidesPerView: 1.4,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2,
        centeredSlides: false,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        centeredSlides: false,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        centeredSlides: false,
        spaceBetween: 20,
      },
    },
  });
}
