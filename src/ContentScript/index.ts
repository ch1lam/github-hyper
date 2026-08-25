import { shouldSyncContents, syncContents } from "./contents";
import styles from "./index.module.scss";

const BACK_TO_TOP_ID = "github-hyper-back-to-top";
const SHOW_BUTTON_AFTER = 320;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
};

const createBackToTopButton = () => {
  const existingButton = document.getElementById(BACK_TO_TOP_ID);
  if (existingButton instanceof HTMLButtonElement) {
    return existingButton;
  }

  const button = document.createElement("button");
  button.id = BACK_TO_TOP_ID;
  button.className = styles.backTopBtn;
  button.type = "button";
  button.title = "Back to top";
  button.setAttribute("aria-label", "Back to top");
  button.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M12 4.5a.75.75 0 0 1 .53.22l5.25 5.25a.75.75 0 1 1-1.06 1.06l-3.97-3.97V19a.75.75 0 0 1-1.5 0V7.06l-3.97 3.97a.75.75 0 0 1-1.06-1.06l5.25-5.25A.75.75 0 0 1 12 4.5Z"/>
    </svg>
  `;
  button.addEventListener("click", backToTop);
  document.body.appendChild(button);
  return button;
};

const bindBackToTopVisibility = (button: HTMLButtonElement) => {
  let animationFrame = 0;

  const update = () => {
    animationFrame = 0;
    button.classList.toggle(styles.visible, window.scrollY > SHOW_BUTTON_AFTER);
  };

  const scheduleUpdate = () => {
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  update();
};

const init = () => {
  if (!document.body) {
    return;
  }

  bindBackToTopVisibility(createBackToTopButton());
  syncContents();

  let syncFrame = 0;
  const observer = new MutationObserver((mutations) => {
    if (!shouldSyncContents(mutations) || syncFrame) {
      return;
    }

    syncFrame = window.requestAnimationFrame(() => {
      syncFrame = 0;
      syncContents();
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

if (document.body) {
  init();
} else {
  window.addEventListener("DOMContentLoaded", init, { once: true });
}
