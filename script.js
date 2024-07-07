gsap.registerPlugin(ScrollTrigger);

const container = document.querySelector('.container');

gsap.to(container, {
    x: () => -(container.scrollWidth - document.documentElement.clientWidth),
    ease: "none",
    scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => "+=" + (container.scrollWidth - document.documentElement.clientWidth),
        invalidateOnRefresh: true
    }
});