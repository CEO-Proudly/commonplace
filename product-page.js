const products = window.COMMONPLACE_PRODUCTS || [];
const productId = new URLSearchParams(window.location.search).get("id");
const product = products.find((item) => item.id === productId);

document.querySelector("#year").textContent = String(new Date().getFullYear());

if (product) {
  document.title = `${product.name} by ${product.vendor} — Commonplace`;
  document.querySelector('meta[name="description"]').content = `${product.description} Shop directly with ${product.vendor}.`;
  document.querySelector("#product-breadcrumb").textContent = product.name;
  document.querySelector("#detail-category").textContent = product.categoryLabel;
  document.querySelector("#detail-vendor").textContent = product.vendor;
  document.querySelector("#detail-title").textContent = product.name;
  document.querySelector("#detail-description").textContent = product.description;

  const image = document.querySelector("#detail-image");
  image.src = product.image;
  image.alt = product.imageAlt;

  const vendorLink = document.querySelector("#vendor-link");
  vendorLink.href = product.affiliateUrl || product.url;
  vendorLink.textContent = product.affiliateUrl ? "Shop the official listing" : "Visit the official shop";
  const linkArrow = document.createElement("span");
  linkArrow.setAttribute("aria-hidden", "true");
  linkArrow.textContent = " ↗";
  vendorLink.append(linkArrow);
  vendorLink.setAttribute("aria-label", product.affiliateUrl
    ? `Affiliate link: visit ${product.vendor}'s shop to view ${product.name}`
    : `Visit ${product.vendor}'s official shop to view ${product.name}`);

  const detailDisclosure = document.querySelector("#detail-disclosure");
  detailDisclosure.textContent = product.affiliateUrl
    ? "This is an affiliate link. Commonplace may earn a commission if you buy through it, at no extra cost to you. The vendor handles the sale, returns, and shipping."
    : "Commonplace currently earns no commission from this link. Purchases, returns, product details, and shipping are handled by the vendor. Availability varies by country.";

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  if (related.length > 0) {
    const relatedSection = document.querySelector("#related-section");
    const relatedGrid = document.querySelector("#related-grid");
    relatedSection.hidden = false;

    related.forEach((item) => {
      const card = document.createElement("article");
      card.className = "product-card";

      const link = document.createElement("a");
      link.className = "product-image";
      link.href = `product.html?id=${encodeURIComponent(item.id)}`;
      link.setAttribute("aria-label", `View ${item.name}`);

      const relatedImage = document.createElement("img");
      relatedImage.src = item.image;
      relatedImage.alt = item.imageAlt;
      relatedImage.loading = "lazy";
      relatedImage.decoding = "async";

      const badge = document.createElement("span");
      badge.className = "product-badge";
      badge.textContent = item.categoryLabel;
      link.append(relatedImage, badge);

      const info = document.createElement("div");
      info.className = "product-info";
      const copy = document.createElement("div");
      const maker = document.createElement("p");
      maker.className = "product-maker";
      maker.textContent = item.vendor;
      const title = document.createElement("h3");
      title.textContent = item.name;
      copy.append(maker, title);
      info.append(copy);

      card.append(link, info);
      relatedGrid.append(card);
    });
  }
} else {
  document.title = "Product not found — Commonplace";
  document.querySelector("#product-detail").innerHTML =
    '<div class="product-not-found"><p class="eyebrow">That find has moved</p><h1>We couldn’t find this product.</h1><p>It may have been removed from the collection. Browse the marketplace for something else.</p><a class="button button-dark" href="index.html#discover">Browse the marketplace <span aria-hidden="true">↗</span></a></div>';
}
