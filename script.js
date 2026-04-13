const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const body = document.body;
const header = document.querySelector(".site-header");
const sections = document.querySelectorAll("main section[id]");
const menuLinks = document.querySelectorAll(".menu a");
const heroStage = document.getElementById("heroStage");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
    body.classList.toggle("menu-open");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      body.classList.remove("menu-open");
    });
  });
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

document.addEventListener("mousemove", (event) => {
  document.documentElement.style.setProperty("--spot-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--spot-y", `${event.clientY}px`);
});

if (heroStage && window.matchMedia("(min-width: 761px)").matches) {
  heroStage.addEventListener("mousemove", (event) => {
    const rect = heroStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroStage.style.transform = `rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
  });

  heroStage.addEventListener("mouseleave", () => {
    heroStage.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const counters = document.querySelectorAll("[data-count]");

function animateCounter(element) {
  const target = Number(element.dataset.count);
  const decimalMode = target === 49;
  const finalValue = decimalMode ? 4.9 : target;

  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const current = finalValue * progress;

    if (decimalMode) {
      element.textContent = current.toFixed(1);
    } else {
      element.textContent = Math.floor(current).toLocaleString("es-ES");
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = decimalMode
        ? finalValue.toFixed(1)
        : finalValue.toLocaleString("es-ES");
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.55 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const filterButtons = document.querySelectorAll(".filter-btn");
const catalogCards = document.querySelectorAll(".catalog-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    catalogCards.forEach((card) => {
      const categories = card.dataset.category;

      if (filter === "all" || categories.includes(filter)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const catalogImages = document.querySelectorAll(".catalog-image");

function closeLightbox() {
  lightbox.classList.remove("active");
  lightboxImage.src = "";
  body.classList.remove("menu-open");
}

catalogImages.forEach((image) => {
  image.addEventListener("click", () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("active");
    body.classList.add("menu-open");
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

const reviewSlides = document.querySelectorAll(".review-slide");
const reviewDots = document.querySelectorAll(".review-dots .dot");
const prevReview = document.getElementById("prevReview");
const nextReview = document.getElementById("nextReview");
let currentReview = 0;
let reviewInterval;

function showReview(index) {
  reviewSlides.forEach((slide) => slide.classList.remove("active"));
  reviewDots.forEach((dot) => dot.classList.remove("active"));

  reviewSlides[index].classList.add("active");
  reviewDots[index].classList.add("active");
  currentReview = index;
}

function nextSlide() {
  const nextIndex = (currentReview + 1) % reviewSlides.length;
  showReview(nextIndex);
}

function prevSlide() {
  const prevIndex = (currentReview - 1 + reviewSlides.length) % reviewSlides.length;
  showReview(prevIndex);
}

function startReviewAuto() {
  reviewInterval = setInterval(nextSlide, 5000);
}

function resetReviewAuto() {
  clearInterval(reviewInterval);
  startReviewAuto();
}

if (nextReview) {
  nextReview.addEventListener("click", () => {
    nextSlide();
    resetReviewAuto();
  });
}

if (prevReview) {
  prevReview.addEventListener("click", () => {
    prevSlide();
    resetReviewAuto();
  });
}

reviewDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showReview(Number(dot.dataset.index));
    resetReviewAuto();
  });
});

if (reviewSlides.length > 0) {
  startReviewAuto();
}

const currentDay = new Date().getDay();
const scheduleItems = document.querySelectorAll(".schedule-list li");

scheduleItems.forEach((item) => {
  if (Number(item.dataset.day) === currentDay) {
    item.classList.add("today");
  }
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const activeLink = document.querySelector(`.menu a[href="#${id}"]`);

      if (entry.isIntersecting) {
        menuLinks.forEach((link) => link.classList.remove("active"));
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-20% 0px -35% 0px"
  }
);

sections.forEach((section) => sectionObserver.observe(section));
