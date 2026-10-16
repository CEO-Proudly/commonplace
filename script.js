const filterButtons = document.querySelectorAll(".filter-chip");
const productCards = document.querySelectorAll(".product-card");
const searchInput = document.querySelector("#product-search");
const emptyState = document.querySelector("#empty-state");

let activeCategory = "all";

function updateProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
    const matchesSearch = card.dataset.search.includes(query);
    const isVisible = matchesCategory && matchesSearch;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    updateProducts();
  });
});

searchInput.addEventListener("input", updateProducts);

document.querySelectorAll(".save-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!isSaved));
    button.textContent = isSaved ? "♡" : "♥";
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

document.querySelector("#newsletter-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = document.querySelector("#newsletter-email");
  const message = document.querySelector("#form-message");
  const submitButton = form.querySelector('button[type="submit"]');
  const endpoint = form.dataset.endpoint;

  if (!endpoint || endpoint.includes("REPLACE_WITH_YOUR_FORM_ID")) {
    message.textContent = "Signup isn't connected yet. Add your Formspree endpoint in index.html to enable it.";
    return;
  }

  submitButton.disabled = true;
  message.textContent = "Adding you to the list...";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value,
        _gotcha: form.elements.namedItem("_gotcha").value
      })
    });

    if (!response.ok) {
      message.textContent = "We couldn't submit your signup. Please try again in a moment.";
      return;
    }

    message.textContent = "You're on the list! Keep an eye on your inbox.";
    form.reset();
  } catch {
    message.textContent = "We couldn't reach the signup service. Check your connection and try again.";
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#year").textContent = String(new Date().getFullYear());
