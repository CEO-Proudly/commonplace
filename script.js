const products = window.COMMONPLACE_PRODUCTS || [];
const filterButtons = document.querySelectorAll(".filter-chip");
const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#product-search");
const emptyState = document.querySelector("#empty-state");
const savedProducts = new Set();
let activeCategory = "all";

function renderProduct(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.category = product.category;
  card.dataset.search = `${product.name} ${product.vendor} ${product.categoryLabel} ${product.description}`.toLowerCase();

  const detailUrl = `product.html?id=${encodeURIComponent(product.id)}`;
  const imageLink = document.createElement("a");
  imageLink.className = "product-image";
  imageLink.href = detailUrl;
  imageLink.setAttribute("aria-label", `View ${product.name}`);

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.imageAlt;
  image.loading = "lazy";
  image.decoding = "async";

  const badge = document.createElement("span");
  badge.className = "product-badge";
  badge.textContent = product.categoryLabel;
  imageLink.append(image, badge);

  const saveButton = document.createElement("button");
  saveButton.className = "save-button";
  saveButton.type = "button";
  saveButton.setAttribute("aria-label", `Save ${product.name}`);
  saveButton.setAttribute("aria-pressed", "false");
  saveButton.textContent = "♡";
  saveButton.addEventListener("click", () => {
    const isSaved = savedProducts.has(product.id);
    if (isSaved) savedProducts.delete(product.id);
    else savedProducts.add(product.id);
    saveButton.setAttribute("aria-pressed", String(!isSaved));
    saveButton.textContent = isSaved ? "♡" : "♥";
  });

  const info = document.createElement("div");
  info.className = "product-info";
  const copy = document.createElement("div");
  const maker = document.createElement("p");
  maker.className = "product-maker";
  maker.textContent = product.vendor;
  const title = document.createElement("h3");
  const titleLink = document.createElement("a");
  titleLink.href = detailUrl;
  titleLink.textContent = product.name;
  title.append(titleLink);
  copy.append(maker, title);

  const details = document.createElement("a");
  details.className = "product-price product-details-link";
  details.href = detailUrl;
  details.textContent = "Details ↗";
  info.append(copy, details);
  card.append(imageLink, saveButton, info);
  return card;
}

products.forEach((product) => productGrid.append(renderProduct(product)));

function updateProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  productGrid.querySelectorAll(".product-card").forEach((card) => {
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
