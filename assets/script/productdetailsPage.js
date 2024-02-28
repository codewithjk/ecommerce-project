var options = {
  width: 400,
  zoomWidth: 500,
  offset: { vertical: 0, horizontal: 10 },
  zoomContainer: document.getElementById("zoom-container"),
  scale: 0.7,
};
new ImageZoom(document.getElementById("img-container"), options);

var swiper = new Swiper(".productSwiper", {
  spaceBetween: 10,
  slidesPerView: 4,
  mousewheel: true,
  freeMode: true,
  watchSlidesProgress: true,
  breakpoints: {
    992: {
      slidesPerView: 4,
      spaceBetween: 10,
      direction: "vertical",
    },
  },
});
var swiper2 = new Swiper(".productSwiper2", {
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
});
