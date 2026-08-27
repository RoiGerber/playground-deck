import "./styles.css";

const deck = document.querySelector(".deck-shell");
const slides = [...document.querySelectorAll(".slide")];
const marks = [...document.querySelectorAll(".mark")];
const currentSlide = document.querySelector("#current-slide");
const totalSlides = document.querySelector("#total-slides");
const prevButton = document.querySelector("#prev-slide");
const nextButton = document.querySelector("#next-slide");
const phone = document.querySelector(".phone");
const metricBars = [...document.querySelectorAll(".bar-stack, .metric-bar, .event-row")];
const linkPreviewGrid = document.querySelector(".link-preview-grid");
const linkPreviewCards = [...document.querySelectorAll(".link-preview-card")];

const chartDates = [
  "Jul 27",
  "Jul 28",
  "Jul 29",
  "Jul 30",
  "Jul 31",
  "Aug 01",
  "Aug 02",
  "Aug 03",
  "Aug 04",
  "Aug 05",
  "Aug 06",
  "Aug 07",
  "Aug 08",
  "Aug 09",
  "Aug 10",
  "Aug 11",
  "Aug 12",
  "Aug 13",
  "Aug 14",
  "Aug 15",
  "Aug 16",
  "Aug 17",
  "Aug 18",
  "Aug 19",
  "Aug 20",
  "Aug 21",
  "Aug 22",
  "Aug 23",
  "Aug 24",
  "Aug 25",
];

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

metricBars.forEach((bar) => {
  const styles = getComputedStyle(bar);

  if (bar.classList.contains("bar-stack")) {
    const index = [...bar.parentElement.querySelectorAll(".bar-stack")].indexOf(bar);
    const date = chartDates[index + 1] ?? `Day ${index + 1}`;
    const organic = Number.parseFloat(styles.getPropertyValue("--green")) || 0;
    const nonOrganic = Number.parseFloat(styles.getPropertyValue("--blue")) || 0;
    bar.dataset.tooltip = `${date} | Total ${organic + nonOrganic} | Organic ${organic} | Non-organic ${nonOrganic}`;
    return;
  }

  if (bar.classList.contains("metric-bar")) {
    const index = [...bar.parentElement.querySelectorAll(".metric-bar")].indexOf(bar);
    const date = chartDates[index] ?? `Day ${index + 1}`;
    const value = Number.parseFloat(styles.getPropertyValue("--value")) || 0;
    bar.dataset.tooltip = `${date} | ${value} active users`;
    return;
  }

  const eventName = bar.querySelector("span")?.textContent?.trim();
  const eventValue = bar.querySelector("strong")?.textContent?.trim();
  bar.dataset.tooltip = `${eventName}: ${eventValue}`;
});

linkPreviewCards.forEach((card) => {
  card.addEventListener("pointerenter", () => {
    linkPreviewGrid?.classList.add("is-preview-focused");
    linkPreviewCards.forEach((previewCard) => {
      previewCard.classList.remove("is-focused");
    });
    card.classList.add("is-focused");
  });
});

linkPreviewGrid?.addEventListener("pointerleave", () => {
  linkPreviewGrid.classList.remove("is-preview-focused");
  linkPreviewCards.forEach((card) => {
    card.classList.remove("is-focused");
  });
});

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
