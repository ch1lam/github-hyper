import styles from "../ContentScript/index.module.scss";
import createContents from "../ContentScript/contents";

/**
 * When the user clicks on the button, scroll to the top of the document
 */
const backToTop = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

const backTopBtn: HTMLButtonElement = document.createElement("button");
// btn style
backTopBtn.id = "backTopBtn";
backTopBtn.textContent = "🔝";
backTopBtn.addEventListener("click", backToTop);
backTopBtn.className += `${styles.backTopBtn}`;

const showBackTopBtn = () => {
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    backTopBtn.style.opacity = "1";
    backTopBtn.style.visibility = "visible";
  } else {
    backTopBtn.style.opacity = "0";
    backTopBtn.style.visibility = "hidden";
  }
};

/**
 * When the user scrolls down 20px from the top of the document, show the button
 */
window.onscroll = () => {
  showBackTopBtn();
};

const createBackTopBtn = () => {
  const tag = document.querySelector("body");
  if (!tag) {
    return;
  }
  tag.insertAdjacentElement("beforeend", backTopBtn);
};

const init = () => {
  createBackTopBtn();
  createContents();
  document.addEventListener("pjax:end", () => {
    document.getElementById("table-of-contents-wrapper")?.remove();
    createContents();
  });
};

init();
