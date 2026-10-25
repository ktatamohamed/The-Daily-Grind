const menuItems = {
  coffee: [
    ["House espresso", "Chocolate, orange & a little bit of sunshine.", "$3.50"],
    ["Flat white", "Velvety steamed milk, double espresso.", "$4.50"],
    ["Honey oat latte", "Local honey, oat milk, a pinch of cinnamon.", "$5.50"],
    ["Slow pour", "Single-origin, brewed one cup at a time.", "$5.00"],
    ["Cortado", "Equal parts espresso and silky steamed milk.", "$4.00"],
    ["Cold brew", "Steeped for 18 hours. Smooth all day.", "$4.75"]
  ],
  drinks: [
    ["Matcha latte", "Stone-ground matcha, gently whisked.", "$5.50"],
    ["Golden chai", "Our house-spiced blend, steeped slow.", "$5.00"],
    ["Rose lemonade", "Fresh lemon, a hint of rose, lots of ice.", "$4.50"],
    ["Drinking chocolate", "Dark chocolate, steamed milk, sea salt.", "$5.25"],
    ["Iced hibiscus tea", "Bright, floral, and brewed in-house.", "$4.00"],
    ["Seasonal spritz", "Ask us what we're pouring this week.", "$5.00"]
  ],
  pastries: [
    ["Butter croissant", "Flaky, golden, baked fresh every morning.", "$4.25"],
    ["Cardamom bun", "Soft, fragrant, finished with pearl sugar.", "$4.75"],
    ["Morning muffin", "Seasonal fruit, brown sugar crumble.", "$4.50"],
    ["Almond financier", "Toasty brown butter, ground almonds.", "$3.75"],
    ["Banana bread", "Ripe bananas, walnuts, a little sea salt.", "$4.00"],
    ["Chocolate cookie", "Crisp edges, gooey middle, still warm.", "$3.50"]
  ],
  food: [
    ["Avocado toast", "Sourdough, smashed avocado, chili crunch.", "$11.00"],
    ["Market greens", "Soft herbs, shaved vegetables, lemon.", "$12.50"],
    ["Breakfast sandwich", "Egg, cheddar, greens on a house bun.", "$10.50"],
    ["Ricotta toast", "Whipped ricotta, seasonal fruit, honey.", "$9.50"],
    ["Soup of the day", "Made from scratch. Ask about today's pot.", "$9.00"],
    ["Granola bowl", "House granola, thick yogurt, local fruit.", "$8.50"]
  ]
};

const menuTabs = [...document.querySelectorAll(".menu-tab")];
const menuGrid = document.querySelector("#menu-items");
const supportsTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function addTiltEffect(elements) {
  if (!supportsTilt) return;
  elements.forEach(element => {
    element.addEventListener("pointermove", event => {
      const bounds = element.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
      element.style.setProperty("--tilt-x", `${horizontal * 8}deg`);
      element.style.setProperty("--tilt-y", `${vertical * -8}deg`);
    });
    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
    });
  });
}

function renderMenu(category) {
  menuGrid.replaceChildren(...menuItems[category].map(([name, description, price]) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = name;
    const copy = document.createElement("p");
    copy.textContent = description;
    const cost = document.createElement("span");
    cost.className = "menu-price";
    cost.textContent = price;
    details.append(title, copy);
    card.append(details, cost);
    return card;
  }));
  addTiltEffect(menuGrid.querySelectorAll(".menu-card"));
}

menuTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectMenuTab(tab));
  tab.addEventListener("keydown", event => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? menuTabs.length - 1 :
      (index + (event.key === "ArrowRight" ? 1 : -1) + menuTabs.length) % menuTabs.length;
    selectMenuTab(menuTabs[nextIndex]);
    menuTabs[nextIndex].focus();
  });
});

function selectMenuTab(selectedTab) {
  menuTabs.forEach(tab => {
    const selected = tab === selectedTab;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  menuGrid.setAttribute("aria-labelledby", selectedTab.id);
  renderMenu(selectedTab.dataset.category);
}

renderMenu("coffee");
addTiltEffect(document.querySelectorAll(".gallery-item"));

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !expanded);
});
navLinks.addEventListener("click", event => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }
});

const slides = [...document.querySelectorAll(".review-slide")];
let currentSlide = 0;
document.querySelectorAll(".review-arrow").forEach(button => {
  button.addEventListener("click", () => {
    slides[currentSlide].hidden = true;
    currentSlide = (currentSlide + Number(button.dataset.direction) + slides.length) % slides.length;
    slides[currentSlide].hidden = false;
    document.querySelector(".review-count").innerHTML = `${String(currentSlide + 1).padStart(2, "0")} <i>/</i> ${String(slides.length).padStart(2, "0")}`;
  });
});

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const closeLightbox = () => lightbox.close();
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector("img").alt;
    lightboxCaption.textContent = item.querySelector("span").textContent;
    lightbox.showModal();
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

const dateInput = document.querySelector("#guest-date");
const localDate = new Date();
dateInput.min = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
document.querySelector("#reservation-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const name = String(formData.get("name")).trim();
  const message = document.querySelector("#form-message");
  message.textContent = `Thanks, ${name}! This demo doesn't send reservations. Please call (212) 555-0146 to book.`;
  form.reset();
  dateInput.min = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
});

document.querySelector("#year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("is-visible"));
}
