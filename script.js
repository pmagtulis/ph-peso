gsap.registerPlugin(ScrollTrigger);

const image = document.querySelector(".massiveImage");

gsap.to(image, {
  x: () => - (image.clientWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: image,
    start: "top top",
    end: () => (image.clientWidth - window.innerWidth),
    scrub: true,
    pin: true,
    invalidateOnRefresh: true,
    anticipatePin: 1,
    markers: true,
  }
});