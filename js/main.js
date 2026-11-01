const siteHeader = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const contactForm = document.querySelector("#contact-form");
const phoneInput = document.querySelector("#contact-phone");
const confirmationModal = document.querySelector("#confirmation-modal");
const confirmationClose = document.querySelector(".confirmation-close");
const diplomaSlider = document.querySelector(".diploma-slider");
const diplomaSlides = [...document.querySelectorAll(".diploma-slide")];
const previousDiploma = document.querySelector(".slider-arrow-previous");
const nextDiploma = document.querySelector(".slider-arrow-next");
let activeDiploma = 0;

function updateHeader() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "");
  const nationalDigits = digits.startsWith("7") || digits.startsWith("8")
    ? digits.slice(1, 11)
    : digits.slice(0, 10);
  const parts = nationalDigits;
  let formatted = "+7";

  if (parts.length > 0) {
    formatted += ` (${parts.slice(0, 3)}`;
  }

  if (parts.length >= 3) {
    formatted += ")";
  }

  if (parts.length > 3) {
    formatted += ` ${parts.slice(3, 6)}`;
  }

  if (parts.length > 6) {
    formatted += `-${parts.slice(6, 8)}`;
  }

  if (parts.length > 8) {
    formatted += `-${parts.slice(8, 10)}`;
  }

  return formatted;
}

function updatePhoneValidity() {
  const digits = phoneInput.value.replace(/\D/g, "");
  const nationalDigits = digits.startsWith("7") || digits.startsWith("8")
    ? digits.slice(1)
    : digits;
  phoneInput.setCustomValidity(nationalDigits.length === 10 ? "" : "Введите номер полностью.");
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Открыть меню" : "Закрыть меню");
    primaryNav.classList.toggle("is-open", !isExpanded);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Открыть меню");
      primaryNav.classList.remove("is-open");
    }
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

if (phoneInput && contactForm && confirmationModal) {
  phoneInput.addEventListener("input", () => {
    phoneInput.value = formatPhone(phoneInput.value);
    updatePhoneValidity();
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updatePhoneValidity();

    if (!contactForm.reportValidity()) {
      return;
    }

    confirmationModal.showModal();
    contactForm.reset();
    phoneInput.setCustomValidity("");
  });

  if (confirmationClose) {
    confirmationClose.addEventListener("click", () => {
      confirmationModal.close();
      window.location.href = "index.html";
    });
  }
}

if (diplomaSlider && previousDiploma && nextDiploma) {
  function showDiploma(index) {
    activeDiploma = Math.max(0, Math.min(index, diplomaSlides.length - 1));
    diplomaSlider.dataset.activeSlide = String(activeDiploma);

    diplomaSlides.forEach((slide, slideIndex) => {
      slide.toggleAttribute("inert", slideIndex !== activeDiploma);
      slide.setAttribute("aria-current", String(slideIndex === activeDiploma));
    });

    previousDiploma.disabled = activeDiploma === 0;
    nextDiploma.disabled = activeDiploma === diplomaSlides.length - 1;
  }

  previousDiploma.addEventListener("click", () => showDiploma(activeDiploma - 1));
  nextDiploma.addEventListener("click", () => showDiploma(activeDiploma + 1));
  showDiploma(0);
}
