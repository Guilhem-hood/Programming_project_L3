document.querySelectorAll("[data-scroll]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const target = trigger.getAttribute("data-scroll");
    const destination = document.querySelector(target);
    if (destination) {
      event.preventDefault();
      destination.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const heroMockup = document.querySelector(".hero__mockup");
heroMockup.style.background = "none";
heroMockup.style.borderRadius = "0";
heroMockup.style.boxShadow = "none";
heroMockup.style.width = "100%";
heroMockup.style.height = "200px";
heroMockup.style.position = "relative";
heroMockup.style.transform = "translateY(240px)";
heroMockup.style.top = "150px";

const yearLabel = document.getElementById("year");
if (yearLabel) {
  yearLabel.textContent = new Date().getFullYear();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15 }
);

document
  .querySelectorAll(
    ".layer-card, .concept-card, .platform-preview__card, .profile__content, .profile__media img"
  )
  .forEach((el) => {
    observer.observe(el);
  });

const conceptSection = document.querySelector("#concept");
const primaryVideo = document.querySelector(".bg-video--primary");
const secondaryVideo = document.querySelector(".bg-video--secondary");

if (conceptSection && primaryVideo && secondaryVideo) {
  let secondaryTriggered = false;
  let conceptInView = false;
  let primaryComplete = false;
  let videoObserver;

  const snapToLastFrame = (video) => {
    const endTime = Math.max((video.duration || 0) - 0.05, 0);
    video.currentTime = endTime;
  };

  const startSecondary = () => {
    if (secondaryTriggered) return;
    secondaryTriggered = true;
    secondaryVideo.classList.add("is-active");
    secondaryVideo.currentTime = 0;
    const playPromise = secondaryVideo.play?.();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
    if (videoObserver) {
      videoObserver.unobserve(conceptSection);
    }
  };

  primaryVideo.addEventListener("ended", () => {
    primaryVideo.pause();
    snapToLastFrame(primaryVideo);
    primaryComplete = true;
    if (conceptInView) {
      startSecondary();
    }
  });

  secondaryVideo.addEventListener("ended", () => {
    secondaryVideo.pause();
    snapToLastFrame(secondaryVideo);
  });

  secondaryVideo.addEventListener("playing", () => {
    primaryVideo.classList.add("is-hidden");
  });

  videoObserver = new IntersectionObserver(
    (entries) => {
      conceptInView = entries.some((entry) => entry.isIntersecting);
      if (conceptInView && primaryComplete && !secondaryTriggered) {
        startSecondary();
      }
    },
    { threshold: 0.35 }
  );

  videoObserver.observe(conceptSection);
}

