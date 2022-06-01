/**
 * When the user scrolls down 20px from the top of the document, show the button
 */
window.onscroll = () => {
  const showBackTopBtn = () => {
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
      backTopBtn.style.display = "flex";
    } else {
      backTopBtn.style.display = "none";
    }
  };
  showBackTopBtn();
};

/**
 * When the user clicks on the button, scroll to the top of the document
 */
const backToTop = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

const backTopBtn: HTMLButtonElement = document.createElement("button");
// btn style
backTopBtn.id = "backToTopBtn";
backTopBtn.textContent = "🔝";
backTopBtn.addEventListener("click", () => backToTop());
backTopBtn.style.width = "40px";
backTopBtn.style.height = "40px";
backTopBtn.style.display = "none";
backTopBtn.style.alignItems = "center";
backTopBtn.style.justifyContent = "center";
backTopBtn.style.position = "fixed";
backTopBtn.style.backgroundColor = "#fff";
backTopBtn.style.right = "40px";
backTopBtn.style.bottom = "40px";
backTopBtn.style.zIndex = "99";
backTopBtn.style.border = "none";
backTopBtn.style.outline = "none";
backTopBtn.style.color = "#24292f";
backTopBtn.style.cursor = "pointer";
backTopBtn.style.fontSize = "20px";
backTopBtn.style.borderRadius = "50%";
backTopBtn.style.boxShadow = "0 0 6px rgb(0 0 0 / 12%)";

const addBackTopBtn = () => {
  const tag = document.querySelector("body");
  if (!tag) {
    return;
  }
  tag.insertAdjacentElement("beforeend", backTopBtn);
};

const init = () => {
  addBackTopBtn();
};

init();
