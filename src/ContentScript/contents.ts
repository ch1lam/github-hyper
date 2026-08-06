import styles from "./index.module.scss";

interface TitleInfo {
  id: string;
  title: string;
  level: number;
}

const README_SELECTORS = [
  "#readme-ov-file .markdown-body",
  ".markdown-body",
];

const SIDEBAR_SELECTORS = [
  '[data-component="SplitPageLayout.Sidebar"]',
  "div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end div.Layout-sidebar",
];

export const titles: TitleInfo[] = [];

const findReadme = (): HTMLElement | null => {
  for (const selector of README_SELECTORS) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      return element;
    }
  }
  return null;
};

const findSidebar = (): HTMLElement | null => {
  for (const selector of SIDEBAR_SELECTORS) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      return element;
    }
  }
  return null;
};

/**
 * Crawl heading tags from the rendered README
 */
const extractTitles = (): TitleInfo[] => {
  const readme = findReadme();
  if (!readme) {
    return [];
  }

  const result: TitleInfo[] = [];
  readme.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((element) => {
    const heading = element as HTMLElement;
    const id = heading.id || heading.firstElementChild?.id;
    if (!id) {
      return;
    }
    result.push({
      id,
      title: heading.textContent ?? "",
      level: Number(heading.nodeName.substring(1, 2)),
    });
  });
  return result;
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

  titles.map((titleInfo) => {
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
export const createContents = () => {
  if (document.getElementById("table-of-contents-wrapper")) {
    return;
  }

  titles.length = 0;
  titles.push(...extractTitles());

  const sidebar = findSidebar();
  if (!titles.length || !sidebar) {
    return;
  }

  sidebar.insertAdjacentElement("beforeend", render(titles));
};
