import styles from "./index.module.scss";

interface TitleInfo {
  id: string;
  title: string;
  level: number;
  nodeName: string;
}

export const titleTag = ["H1", "H2", "H3", "H4", "H5", "H6"];
export const titles: TitleInfo[] = [];

/**
 * Crawl title tags
 */
export const article = document.querySelector("readme-toc article");

/**
 * Traversing articles and package header labels
 */
const traverseArticle = () => {
  if (!article) {
    console.log("can't find article");
    return;
  }

  Array.from(article.children).forEach((element, _index) => {
    if (titleTag.includes(element.nodeName)) {
      titles.push({
        id: element.firstElementChild!.id,
        title: element.textContent!,
        level: Number(element.nodeName.substring(1, 2)),
        nodeName: element.nodeName,
      });
    }
  });
};

/**
 * Component rendering style
 */
const render = (titles: TitleInfo[]) => {
  const nav: HTMLElement = document.createElement("nav");
  const contents: HTMLUListElement = document.createElement("ul");
  nav.id = "table-of-contents-wrapper";
  nav.className += `${styles.toc}`;
  contents.id = "table-of-contents";

  titles.map((titleInfo, index) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const text = document.createTextNode(titleInfo.title);

    a.style.paddingLeft = `${titleInfo.level * 20 - 20}px`;
    a.setAttribute("href", `#${titleInfo.id}`);
    a.appendChild(text);
    li.addEventListener("click", onSelected);
    li.appendChild(a);
    contents.appendChild(li);
  });

  nav.appendChild(contents);

  return nav;
};

/**
 * selected style change
 */
const onSelected = (event: MouseEvent) => {
  const contents = document.getElementById("table-of-contents");
  const current = contents?.querySelector(`.${styles.selected}`);

  if (!event.currentTarget) {
    return;
  }
  if (current && current !== (event.currentTarget as HTMLElement)) {
    current.classList.remove(`${styles.selected}`);
  }
  (event.currentTarget as HTMLElement).classList.add(`${styles.selected}`);
};

/**
 * create table of contents
 */
const createContents = () => {
  if (document.getElementById("table-of-contents-wrapper")) {
    return;
  }
  traverseArticle();
  const tag = document.querySelector(
    "div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end div.Layout-sidebar"
  );
  if (!tag) {
    return;
  }
  tag.insertAdjacentElement("beforeend", render(titles));
};

export default createContents;
