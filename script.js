// script.js

// Menu mobile toggle
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuLinks = document.querySelectorAll("#mobile-menu a");
const navLinks = document.querySelectorAll('a[href^="#"]');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Chiusura menu mobile quando clicco un link
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Smooth scrolling offset per header fisso
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    event.preventDefault();

    const headerOffset = document.querySelector(".header")?.offsetHeight || 78;
    const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset + 2;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  });
});

// Typing effect in hero
const typingElement = document.getElementById("typing");
const textToType = "I am a Full Stack Developer";
let charIndex = 0;
let isDeleting = false;

function runTypingEffect() {
  if (!typingElement) return;

  const currentText = textToType.slice(0, charIndex);
  typingElement.textContent = currentText;

  if (!isDeleting) {
    charIndex++;
    if (charIndex > textToType.length) {
      isDeleting = true;
      setTimeout(runTypingEffect, 1200);
      return;
    }
  } else {
    charIndex--;
    if (charIndex < 0) {
      isDeleting = false;
      charIndex = 0;
    }
  }

  const speed = isDeleting ? 45 : 80;
  setTimeout(runTypingEffect, speed);
}

runTypingEffect();

// Scroll reveal con Intersection Observer API
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((el) => revealObserver.observe(el));