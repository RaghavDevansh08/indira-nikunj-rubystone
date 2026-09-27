// Always start a fresh page at the top and with no enquiry type selected.
(function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function resetPageState() {
    const form = document.getElementById("enquiryForm");
    if (form) {
      form.reset();

      const type = document.getElementById("enquiryType") || form.querySelector('select[name="type"]');
      if (type) {
        type.selectedIndex = 0;
        type.value = "";
      }
    }

    // Delay slightly so browser scroll/form restoration cannot overwrite our reset.
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setTimeout(() => window.scrollTo(0, 0), 50);
  }

  // Initial page load / refresh.
  window.addEventListener("load", resetPageState);

  // Handles browser back-forward cache restoration.
  window.addEventListener("pageshow", function () {
    resetPageState();
  });
})();

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Wedding gallery: show more + lightbox navigation.
const galleryItems = [...document.querySelectorAll(".gallery-item")];
const seeMoreBtn = document.getElementById("seeMoreBtn");
let visibleCount = 12;

seeMoreBtn?.addEventListener("click", () => {
  document.querySelectorAll(".extra-image").forEach(el => el.classList.add("show"));
  seeMoreBtn.textContent = "All Images Shown";
  seeMoreBtn.disabled = true;
  seeMoreBtn.style.opacity = ".6";
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeBtn = document.getElementById("lightboxClose");
const prevBtn = document.getElementById("lightboxPrev");
const nextBtn = document.getElementById("lightboxNext");
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const item = galleryItems[currentIndex];
  if (!item) return;
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.querySelector("img")?.alt || "Rubystone gallery image";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

galleryItems.forEach((item, index) => item.addEventListener("click", () => openLightbox(index)));
closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", () => openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length));
nextBtn.addEventListener("click", () => openLightbox((currentIndex + 1) % galleryItems.length));
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
  if (e.key === "ArrowRight") openLightbox((currentIndex + 1) % galleryItems.length);
});

// Send enquiry details directly to Rubystone on WhatsApp.
const WHATSAPP_NUMBER = "919821005921";

function sendEnquiryToWhatsApp(form, noteElement) {
  const data = new FormData(form);
  const get = key => String(data.get(key) || "").trim();

  const message = [
    "Hello Rubystone Hospitality,",
    "",
    "I would like to make an enquiry.",
    "",
    `Name: ${get("name")}`,
    `Phone: ${get("phone")}`,
    `Email: ${get("email") || "Not provided"}`,
    `Enquiry Type: ${get("type") || "Not provided"}`,
    `Preferred Date: ${get("date") || "Not provided"}`,
    `Guests: ${get("guests") || "Not provided"}`,
    `Message: ${get("message") || "Not provided"}`
  ].join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  if (noteElement) noteElement.textContent = "Opening WhatsApp…";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

document.getElementById("enquiryForm")?.addEventListener("submit", e => {
  e.preventDefault();
  sendEnquiryToWhatsApp(e.target, document.getElementById("formNote"));
});

// Simple reveal animation.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});

document.querySelectorAll(".section, .quick-features").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});
