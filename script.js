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
  setText(".logo", translations.nav.brand);
  setText('#desktop-menu a[href="#home"]', translations.nav.home);
  setText('#desktop-menu a[href="#about"]', translations.nav.about);
  setText('#desktop-menu a[href="#education"]', translations.nav.education);
  setText('#desktop-menu a[href="#experience"]', translations.nav.experience);
  setText('#desktop-menu a[href="#skills"]', translations.nav.skills);
  setText('#desktop-menu a[href="#projects"]', translations.nav.projects);
  setText('#desktop-menu a[href="#contact"]', translations.nav.contact);
  setText('.nav-cta', translations.nav.cta);

  const mobileMenuAnchors = mobileMenu?.querySelectorAll('a[href^="#"]');
  if (mobileMenuAnchors) {
    const mapping = [
      translations.nav.home,
      translations.nav.about,
      translations.nav.education,
      translations.nav.experience,
      translations.nav.skills,
      translations.nav.projects,
      translations.nav.contact,
      translations.nav.cta,
    ];

    mobileMenuAnchors.forEach((anchor, index) => {
      if (mapping[index]) {
        anchor.textContent = mapping[index];
      }
    });
  }

  setAttribute(".menu-toggle", "aria-label", translations.nav.menuOpenLabel);
}

function updateHero(translations) {
  const heroContent = document.querySelector(".hero-content");
  if (!heroContent) return;

  setText(".section-kicker", translations.hero.kicker, heroContent);
  setText(".hero h1", translations.hero.title);
  setNthText("p", 1, translations.hero.description, heroContent);
  setText(".hero-actions .btn-solid", translations.hero.primaryCta);
  setText('.hero-actions .btn-outline[href*="credly.com"]', translations.hero.secondaryCta);
  restartTypingEffect(translations.hero.subtitle);
}

function updateAbout(translations) {
  const aboutContent = document.querySelector(".about-content");
  if (!aboutContent) return;

  setText(".section-kicker", translations.about.kicker, aboutContent);
  setText("h3", translations.about.title, aboutContent);
    setNthHtml("p", 0, `${translations.about.description}<br><i><strong>${translations.about.medicalNote}</strong></i>`, aboutContent);
  setText("div > h4", translations.about.fundamentalsTitle, aboutContent);
  setListText("div > ul > li", translations.about.fundamentals, aboutContent);

  const statBoxes = aboutContent.querySelectorAll(".stat-box");
  statBoxes.forEach((box, index) => {
    const stat = translations.about.stats[index];
    if (!stat) return;

    setText("h4", stat.label, box);
    setHtml("p", stat.value, box);
  });
}

function updateEducation(translations) {
  const educationSection = document.querySelector("#education");
  if (!educationSection) return;

  setText(".section-kicker", translations.education.kicker, educationSection);
  setText("h3", translations.education.title, educationSection);
  setText(".education-intro", translations.education.intro, educationSection);

  const educationCards = educationSection.querySelectorAll(".education-card");
  const trainingCard = educationCards[0];
  const scholarshipCard = educationCards[1];

  if (trainingCard) {
    setText("h4", translations.education.trainingTitle, trainingCard);
    setText("p", translations.education.trainingDescription, trainingCard);
    setListText("li", translations.education.trainingItems, trainingCard);
  }

  if (scholarshipCard) {
    setText("h4", translations.education.scholarshipTitle, scholarshipCard);
    setText("p", translations.education.scholarshipDescription, scholarshipCard);
    setListText("li", translations.education.scholarshipItems, scholarshipCard);
  }

  setText(".education-outcomes h4", translations.education.outcomesTitle, educationSection);
  setListText(".education-tags span", translations.education.outcomesTags, educationSection);
  setText(".education-outcomes > p", translations.education.outcomesDescription, educationSection);
}

function updateExperience(translations) {
  const experienceSection = document.querySelector("#experience");
  if (!experienceSection) return;

  setText(".section-kicker", translations.experience.kicker, experienceSection);
  setText("h3", translations.experience.title, experienceSection);

  const softSkillCards = experienceSection.querySelectorAll(".soft-skill-card");
  softSkillCards.forEach((card, index) => {
    const skills = translations.experience.softSkills[index];
    if (!skills) return;

    setText("h4", skills.title, card);
    setText("p", skills.description, card);
  });

  const sectionHeadings = experienceSection.querySelectorAll(".section-heading");
  if (sectionHeadings[0]) {
    setText("h3", translations.experience.roadmapTitle, sectionHeadings[0]);
    setText(".section-lead", translations.experience.roadmapLead, sectionHeadings[0]);
  }

  const roadMapKicker = experienceSection.querySelectorAll(".section-kicker");
  if (roadMapKicker[1]) {
    roadMapKicker[1].textContent = translations.experience.roadmapKicker;
  }

  setText(".rail-nav-title", translations.experience.roadmapTitleLabel, experienceSection);

  const railLinks = experienceSection.querySelectorAll(".rail-link");
  railLinks.forEach((link, index) => {
    const item = translations.experience.roadmapItems[index];
    if (!item) return;

    const dateElement = link.querySelector(".rail-date");
    const titleElement = link.querySelector(".rail-title");
    if (dateElement) dateElement.textContent = item.date;
    if (titleElement) titleElement.textContent = item.title;
    link.setAttribute("href", item.target);
  });

  const timelineItems = experienceSection.querySelectorAll(".timeline-item");
  timelineItems.forEach((item, index) => {
    const timeline = translations.experience.timeline[index];
    if (!timeline) return;

    setText(".timeline-period", timeline.period, item);
    setText(".timeline-badge", timeline.badge, item);
    setText("h4", timeline.title, item);
    setText("p", timeline.description, item);
  });
}

function updateSkills(translations) {
  const skillsSection = document.querySelector("#skills");
  if (!skillsSection) return;

  setText(".section-kicker", translations.skills.kicker, skillsSection);
  setText("h3", translations.skills.title, skillsSection);
  setText(".skills-intro", translations.skills.intro, skillsSection);
  setText(".skills-scale", translations.skills.scale, skillsSection);

  const headings = skillsSection.querySelectorAll(".skills-heading");
  if (headings[0]) {
    setText("h4", translations.skills.softwareTitle, headings[0]);
    setText("p", translations.skills.softwareDescription, headings[0]);
  }
  if (headings[1]) {
    setText("h4", translations.skills.toolsTitle, headings[1]);
    setText("p", translations.skills.toolsDescription, headings[1]);
  }

  setLevelLabels(translations.skills.levels);
}

function updateProjects(translations) {
  const projectsSection = document.querySelector("#projects");
  if (!projectsSection) return;

  setText(".section-kicker", translations.projects.kicker, projectsSection);
  setText("h3", translations.projects.title, projectsSection);

  const projectCards = projectsSection.querySelectorAll(".project-card");
  projectCards.forEach((card, index) => {
    const project = translations.projects.items[index];
    if (!project) return;

    const image = card.querySelector(".project-image img");
    const title = card.querySelector(".project-content h4");
    const description = card.querySelector(".project-content > p");
    const tags = card.querySelectorAll(".tags span");
    const links = card.querySelectorAll(".project-links a");
    const demoLink = links[0];
    const sourceLink = links[1];

    if (image) {
      image.setAttribute("alt", project.imageAlt);
    }

    if (title) {
      title.textContent = project.title;
    }

    if (description) {
      description.textContent = project.description;
    }

    tags.forEach((tag, tagIndex) => {
      if (project.tags[tagIndex]) {
        tag.textContent = project.tags[tagIndex];
      }
    });

    if (demoLink) {
      demoLink.innerHTML = `<span aria-hidden="true">🌐</span> ${project.demoLabel}`;
      demoLink.setAttribute("href", project.demoUrl);
      demoLink.setAttribute("aria-disabled", String(project.demoUnavailable));
      demoLink.classList.toggle("is-unavailable", Boolean(project.demoUnavailable));
      demoLink.setAttribute("tabindex", project.demoUnavailable ? "-1" : "0");
    }

    if (sourceLink) {
      sourceLink.innerHTML = `<span aria-hidden="true">💻</span> ${project.sourceLabel}`;
      sourceLink.setAttribute("href", project.sourceUrl);
    }
  });

  setText('.hero-actions a[href*="github.com/mirko-ando?tab=repositories"]', translations.projects.archiveCta, projectsSection);
  setAttribute('.hero-actions a[href*="github.com/mirko-ando?tab=repositories"]', 'aria-label', translations.projects.archiveAriaLabel, projectsSection);
}

function updateContact(translations) {
  const contactSection = document.querySelector("#contact");
  if (!contactSection) return;

  setText(".section-kicker", translations.contact.kicker, contactSection);
  setText("h3", translations.contact.title, contactSection);
  setNthText("p", 1, translations.contact.description, contactSection);

  const contactListItems = contactSection.querySelectorAll(".contact-info li");
  if (contactListItems[0]) {
    contactListItems[0].innerHTML = `<strong>${translations.contact.emailLabel}:</strong> mirko.ando.dev@gmail.com`;
  }
  if (contactListItems[1]) {
    contactListItems[1].innerHTML = `<strong>${translations.contact.phoneLabel}:</strong> +39 3296318067`;
  }
  if (contactListItems[2]) {
    contactListItems[2].innerHTML = `<strong>${translations.contact.certificationsLabel}:</strong> <a href="https://www.credly.com/users/mirko-ando" target="_blank" rel="noopener noreferrer" style="color:var(--primary);">${translations.contact.certificationsText}</a>`;
  }

  setText(".socials a", translations.contact.socialLabel, contactSection);
  setAttribute(".contact-visual", "aria-label", translations.contact.qrAriaLabel, contactSection);
  setAttribute(".contact-visual-link", "aria-label", translations.contact.qrLinkLabel, contactSection);
  setAttribute(".contact-qr-image", "alt", translations.contact.qrAlt, contactSection);
  setText(".contact-qr-caption", translations.contact.qrCaption, contactSection);
}

function updateFooter(translations) {
  setText(".footer p", translations.footer.text);
}

function applyTranslations(translations, language) {
  activeTranslations = translations;
  currentLanguage = language;

  document.documentElement.lang = language;
  document.title = translations.meta.title;
  if (documentMetaDescription) {
    documentMetaDescription.setAttribute("content", translations.meta.description);
  }

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
