// script.js

const DEFAULT_LANGUAGE = "it";
const LANGUAGE_STORAGE_KEY = "portfolio-language";
const LANGUAGE_FILES = {
  it: "src/lang/it.json",
  en: "src/lang/en.json",
};
const LANGUAGE_FLAGS = {
  it: {
    src: "src/lang/it.svg",
    alt: "Bandiera italiana",
    label: "IT",
    ariaLabel: "Passa all'italiano",
  },
  en: {
    src: "src/lang/en.svg",
    alt: "Bandiera inglese",
    label: "EN",
    ariaLabel: "Switch to English",
  },
};

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuLinks = document.querySelectorAll("#mobile-menu a");
const navLinks = document.querySelectorAll('a[href^="#"]');
const languageToggleButtons = document.querySelectorAll("[data-lang-toggle]");
const languageFlagImages = document.querySelectorAll("[data-lang-flag]");
const typingElement = document.getElementById("typing");
const documentMetaDescription = document.querySelector('meta[name="description"]');
const languagePreference = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
const initialLanguage = languagePreference === "en" ? "en" : DEFAULT_LANGUAGE;

let currentLanguage = initialLanguage;
let activeTranslations = null;
let typingTimer = null;
let charIndex = 0;
let isDeleting = false;

function getTargetLanguage(language) {
  return language === "it" ? "en" : "it";
}

function setText(selector, value, scope = document) {
  const element = scope.querySelector(selector);
  if (element && typeof value === "string") {
    element.textContent = value;
  }
}

function setHtml(selector, value, scope = document) {
  const element = scope.querySelector(selector);
  if (element && typeof value === "string") {
    element.innerHTML = value;
  }
}

function setAttribute(selector, attributeName, value, scope = document) {
  const element = scope.querySelector(selector);
  if (element && value !== undefined && value !== null) {
    element.setAttribute(attributeName, value);
  }
}

function setListText(selector, values, scope = document) {
  const elements = scope.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (values[index] !== undefined) {
      element.textContent = values[index];
    }
  });
}

function setNthText(selector, index, value, scope = document) {
  const elements = scope.querySelectorAll(selector);
  const element = elements[index];
  if (element && typeof value === "string") {
    element.textContent = value;
  }
}

function setNthHtml(selector, index, value, scope = document) {
  const elements = scope.querySelectorAll(selector);
  const element = elements[index];
  if (element && typeof value === "string") {
    element.innerHTML = value;
  }
}

function setLevelLabels(levelLabels) {
  if (!levelLabels) return;

  document.querySelectorAll(".level-base").forEach((element) => {
    element.textContent = levelLabels.base;
  });
  document.querySelectorAll(".level-mid").forEach((element) => {
    element.textContent = levelLabels.mid;
  });
  document.querySelectorAll(".level-adv").forEach((element) => {
    element.textContent = levelLabels.adv;
  });
}

function restartTypingEffect(text) {
  if (!typingElement) return;

  window.clearTimeout(typingTimer);
  typingElement.textContent = "";
  charIndex = 0;
  isDeleting = false;

  function tick() {
    if (!typingElement) return;

    const currentText = text.slice(0, charIndex);
    typingElement.textContent = currentText;

    if (!isDeleting) {
      charIndex += 1;
      if (charIndex > text.length) {
        isDeleting = true;
        typingTimer = window.setTimeout(tick, 1200);
        return;
      }
    } else {
      charIndex -= 1;
      if (charIndex < 0) {
        isDeleting = false;
        charIndex = 0;
      }
    }

    const speed = isDeleting ? 45 : 80;
    typingTimer = window.setTimeout(tick, speed);
  }

  tick();
}

function updateLanguageControls(language) {
  const targetLanguage = getTargetLanguage(language);
  const targetFlag = LANGUAGE_FLAGS[targetLanguage];

  languageToggleButtons.forEach((button) => {
    button.setAttribute("aria-label", targetFlag.ariaLabel);
    const labelElement = button.querySelector(".lang-toggle__label");
    if (labelElement) {
      labelElement.textContent = targetFlag.label;
    }
  });

  languageFlagImages.forEach((image) => {
    image.setAttribute("src", targetFlag.src);
    image.setAttribute("alt", targetFlag.alt);
  });
}

function updateNav(translations) {
  // Mobile menu labels are handled by data-i18n in translatePage
  
  if (menuToggle && translations.nav) {
    const isOpen = mobileMenu?.classList.contains("open");
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? translations.nav.menuCloseLabel : translations.nav.menuOpenLabel
    );
  }
}

function updateHero(translations) {
  restartTypingEffect(translations.hero.subtitle);
}

function updateAbout(translations) {
  const aboutDesc = document.getElementById("about-description-text");
  if (aboutDesc) {
    aboutDesc.innerHTML = `${translations.about.description}<br><i><strong>${translations.about.medicalNote}</strong></i>`;
  }

  const fundamentalsList = document.getElementById("about-fundamentals-list");
  if (fundamentalsList && translations.about.fundamentals) {
    fundamentalsList.innerHTML = translations.about.fundamentals
      .map((item) => `<li>${item}</li>`)
      .join("");
  }

  const statsContainer = document.getElementById("about-stats-container");
  if (statsContainer && translations.about.stats) {
    const statBoxes = statsContainer.querySelectorAll(".stat-box");
    translations.about.stats.forEach((stat, index) => {
      if (statBoxes[index]) {
        statBoxes[index].querySelector("h4").textContent = stat.label;
        statBoxes[index].querySelector("p").innerHTML = stat.value;
      }
    });
  }
}

function updateEducation(translations) {
  const trainingList = document.getElementById("education-training-list");
  if (trainingList && translations.education.trainingItems) {
    trainingList.innerHTML = translations.education.trainingItems
      .map((item) => `<li>${item}</li>`)
      .join("");
  }

  const scholarshipList = document.getElementById("education-scholarship-list");
  if (scholarshipList && translations.education.scholarshipItems) {
    scholarshipList.innerHTML = translations.education.scholarshipItems
      .map((item) => `<li>${item}</li>`)
      .join("");
  }

  const outcomesTagsContainer = document.getElementById("education-outcomes-tags");
  if (outcomesTagsContainer && translations.education.outcomesTags) {
    outcomesTagsContainer.innerHTML = translations.education.outcomesTags
      .map((tag) => `<span>${tag}</span>`)
      .join("");
  }
}

function updateExperience(translations) {
  const softSkillsContainer = document.getElementById("soft-skills-container");
  if (softSkillsContainer && translations.experience.softSkills) {
    softSkillsContainer.innerHTML = translations.experience.softSkills
      .map(
        (skill) => `
      <article class="soft-skill-card">
        <h4>${skill.title}</h4>
        <p>${skill.description}</p>
      </article>
    `
      )
      .join("");
  }

  const railList = document.getElementById("rail-list");
  if (railList && translations.experience.roadmapItems) {
    railList.innerHTML = translations.experience.roadmapItems
      .map(
        (item) => `
      <li>
        <a class="rail-link" href="${item.target}">
          <span class="rail-date">${item.date}</span>
          <span class="rail-title">${item.title}</span>
        </a>
      </li>
    `
      )
      .join("");
  }

  const timelineContainer = document.getElementById("timeline-container");
  if (timelineContainer && translations.experience.timeline) {
    timelineContainer.innerHTML = translations.experience.timeline
      .map(
        (item, index) => `
      <article class="timeline-item" id="${translations.experience.roadmapItems[index]?.target.replace("#", "") || ""}">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-top">
            <span class="timeline-period">${item.period}</span>
            <span class="timeline-badge">${item.badge}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      </article>
    `
      )
      .join("");
  }
}

function updateSkills(translations) {
  setLevelLabels(translations.skills.levels);
}

function updateProjects(translations) {
  const projectsContainer = document.getElementById("projects-container");
  if (projectsContainer && translations.projects.items) {
    projectsContainer.innerHTML = translations.projects.items
      .map(
        (project) => `
      <article class="project-card">
        <div class="project-image">
          <span><img src="${project.imagePath}" alt="${project.imageAlt}"></span>
        </div>
        <div class="project-content">
          <h4>${project.title}</h4>
          <p>${project.description}</p>
          <div class="tags">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="project-links">
            <a
              href="${project.demoUrl}"
              class="project-link-btn ${project.demoUnavailable ? "is-unavailable" : ""}"
              aria-disabled="${project.demoUnavailable}"
              tabindex="${project.demoUnavailable ? "-1" : "0"}"
            >
              <span aria-hidden="true">🌐</span> ${project.demoLabel}
            </a>
            <a
              href="${project.sourceUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link-btn"
              aria-label="${translations.projects.sourceAriaLabel || "Apri codice sorgente su GitHub"}"
            >
              <span aria-hidden="true">💻</span> ${project.sourceLabel}
            </a>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }
}

function updateContact(translations) {
  const emailEl = document.getElementById("contact-email");
  if (emailEl) {
    emailEl.innerHTML = `<strong>${translations.contact.emailLabel}:</strong> mirko.ando.dev@gmail.com`;
  }

  const phoneEl = document.getElementById("contact-phone");
  if (phoneEl) {
    phoneEl.innerHTML = `<strong>${translations.contact.phoneLabel}:</strong> +39 3296318067`;
  }

  const certsEl = document.getElementById("contact-certifications");
  if (certsEl) {
    certsEl.innerHTML = `<strong>${translations.contact.certificationsLabel}:</strong> <a href="https://www.credly.com/users/mirko-ando" target="_blank" rel="noopener noreferrer" style="color:var(--primary);">${translations.contact.certificationsText}</a>`;
  }

  const contactVisual = document.querySelector(".contact-visual");
  if (contactVisual) {
    contactVisual.setAttribute("aria-label", translations.contact.qrAriaLabel);
  }

  const contactVisualLink = document.querySelector(".contact-visual-link");
  if (contactVisualLink) {
    contactVisualLink.setAttribute("aria-label", translations.contact.qrLinkLabel);
  }

  const contactQrImage = document.querySelector(".contact-qr-image");
  if (contactQrImage) {
    contactQrImage.setAttribute("alt", translations.contact.qrAlt);
  }
}

function updateFooter(translations) {
  // Handled by data-i18n in translatePage
}

function translatePage(translations) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = key.split(".").reduce((obj, i) => obj?.[i], translations);
    if (value && typeof value === "string") {
      el.textContent = value;
    }
  });
}

function applyTranslations(translations, language) {
  activeTranslations = translations;
  currentLanguage = language;

  document.documentElement.lang = language;
  document.title = translations.meta.title;
  if (documentMetaDescription) {
    documentMetaDescription.setAttribute("content", translations.meta.description);
  }

  translatePage(translations);

  updateNav(translations);
  updateHero(translations);
  updateAbout(translations);
  updateEducation(translations);
  updateExperience(translations);
  updateSkills(translations);
  updateProjects(translations);
  updateContact(translations);
  updateFooter(translations);
  updateLanguageControls(language);
}

async function loadLanguage(language) {
  const response = await fetch(LANGUAGE_FILES[language], { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load language file: ${language}`);
  }

  return response.json();
}

async function setLanguage(language) {
  const normalizedLanguage = language === "en" ? "en" : "it";
  const translations = await loadLanguage(normalizedLanguage);
  applyTranslations(translations, normalizedLanguage);
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
}

function bindLanguageToggle() {
  languageToggleButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const nextLanguage = getTargetLanguage(currentLanguage);
      try {
        await setLanguage(nextLanguage);
      } catch (error) {
        console.error(error);
      }
    });
  });
}

function bindNavigation() {
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      if (activeTranslations?.nav) {
        menuToggle.setAttribute(
          "aria-label",
          isOpen ? activeTranslations.nav.menuCloseLabel : activeTranslations.nav.menuOpenLabel
        );
      }
    });
  }

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      if (activeTranslations?.nav && menuToggle) {
        menuToggle.setAttribute("aria-label", activeTranslations.nav.menuOpenLabel);
      }
    });
  });

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
}

function initRevealAnimation() {
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

  revealElements.forEach((element) => revealObserver.observe(element));
}

async function initialize() {
  bindNavigation();
  bindLanguageToggle();
  initRevealAnimation();

  try {
    await setLanguage(currentLanguage);
  } catch (error) {
    console.error(error);
    if (languagePreference !== "en") {
      if (menuToggle) {
        menuToggle.setAttribute("aria-label", "Apri menu");
      }
      restartTypingEffect("Sono un Software Engineer.");
    }
  }
}

initialize();
