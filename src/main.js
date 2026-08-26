import "./styles.css";

const deck = document.querySelector(".deck-shell");
const slides = [...document.querySelectorAll(".slide")];
const marks = [...document.querySelectorAll(".mark")];
const currentSlide = document.querySelector("#current-slide");
const totalSlides = document.querySelector("#total-slides");
const prevButton = document.querySelector("#prev-slide");
const nextButton = document.querySelector("#next-slide");
const phone = document.querySelector(".phone");

let activeIndex = 0;

totalSlides.textContent = slides.length;

const showSlide = (index) => {
  const previousIndex = activeIndex;
  activeIndex = Math.min(Math.max(index, 0), slides.length - 1);

  deck.style.setProperty("--active-slide", activeIndex);
  deck.dataset.direction = activeIndex >= previousIndex ? "forward" : "back";
  currentSlide.textContent = activeIndex + 1;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeIndex);
  });

  marks.forEach((mark, markIndex) => {
    mark.classList.toggle("is-active", markIndex === activeIndex);
    mark.setAttribute("aria-current", markIndex === activeIndex ? "step" : "false");
  });

  prevButton.disabled = activeIndex === 0;
  nextButton.disabled = activeIndex === slides.length - 1;
};

const moveSlide = (offset) => {
  showSlide(activeIndex + offset);
};

marks.forEach((mark, index) => {
  mark.addEventListener("click", () => showSlide(index));
});

prevButton.addEventListener("click", () => moveSlide(-1));
nextButton.addEventListener("click", () => moveSlide(1));

if (phone) {
  phone.addEventListener("pointermove", (event) => {
    const rect = phone.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    phone.style.setProperty("--tilt-x", `${-y * 18}deg`);
    phone.style.setProperty("--tilt-y", `${x * 22}deg`);
    phone.style.setProperty("--tilt-z", `${x * -3}deg`);
  });

  phone.addEventListener("pointerleave", () => {
    phone.style.removeProperty("--tilt-x");
    phone.style.removeProperty("--tilt-y");
    phone.style.removeProperty("--tilt-z");
  });
}

window.addEventListener("keydown", (event) => {
  if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    moveSlide(1);
  }

  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    moveSlide(-1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    showSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    showSlide(slides.length - 1);
  }
});

showSlide(0);
