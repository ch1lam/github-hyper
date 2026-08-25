import styles from "./index.module.scss";

interface TitleInfo {
  element: HTMLElement;
  id: string;
  title: string;
  level: number;
}

const README_SELECTORS = ["#readme-ov-file .markdown-body", ".markdown-body"];

const SIDEBAR_SELECTORS = [
  '[data-component="SplitPageLayout.Sidebar"]',
  "div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end div.Layout-sidebar",
];

const RELEVANT_SELECTOR = [...README_SELECTORS, ...SIDEBAR_SELECTORS].join(",");
const TOC_ID = "github-hyper-table-of-contents";

let mountedReadme: HTMLElement | null = null;
let mountedSidebar: HTMLElement | null = null;
let mountedToc: HTMLElement | null = null;
let mountedSignature = "";
let mountedHeadings: HTMLElement[] = [];
let activeItem: HTMLElement | null = null;
let headingObserver: IntersectionObserver | null = null;
const visibleHeadings = new Set<HTMLElement>();

const findElement = (selectors: string[]): HTMLElement | null => {
  for (const selector of selectors) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      return element;
    }
  }
  return null;
};

const extractTitles = (readme: HTMLElement): TitleInfo[] => {
  const result: TitleInfo[] = [];

  readme.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6").forEach((heading) => {
    const id = heading.id || heading.firstElementChild?.id;
    const title = heading.textContent?.trim();
    if (!id || !title) {
      return;
    }

    result.push({
      element: heading,
      id,
      title,
      level: Number(heading.tagName.slice(1)),
    });
  });

  return result;
};

const setActiveItem = (item: HTMLElement | null) => {
  if (item === activeItem) {
    return;
  }

  activeItem?.classList.remove(styles.selected);
  activeItem?.querySelector("a")?.removeAttribute("aria-current");
  activeItem = item;
  activeItem?.classList.add(styles.selected);
  activeItem?.querySelector("a")?.setAttribute("aria-current", "location");
};

const render = (titles: TitleInfo[]) => {
  const nav = document.createElement("nav");
  nav.id = TOC_ID;
  nav.className = styles.toc;
  nav.setAttribute("aria-label", "README table of contents");

  const header = document.createElement("div");
  header.className = styles.tocHeader;
  header.innerHTML = `
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M2.75 2.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM5 3.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 5 3.25Zm-2.25 4a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM5 8a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 5 8Zm-2.25 4a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM5 12.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z"/>
    </svg>
    <span>On this page</span>
  `;

  const count = document.createElement("span");
  count.className = styles.tocCount;
  count.textContent = String(titles.length);
  count.title = `${titles.length} headings`;
  header.appendChild(count);

  const list = document.createElement("ul");
  list.className = styles.tocList;

  const itemByHeading = new Map<HTMLElement, HTMLElement>();
  const fragment = document.createDocumentFragment();
  const baseLevel = Math.min(...titles.map(({ level }) => level));

  for (const titleInfo of titles) {
    const item = document.createElement("li");
    item.className = styles.tocItem;

    const link = document.createElement("a");
    link.className = styles.tocLink;
    link.href = `#${titleInfo.id}`;
    link.textContent = titleInfo.title;
    link.title = titleInfo.title;
    const indentation = Math.min(titleInfo.level - baseLevel, 3) * 12;
    link.style.setProperty("--toc-indent", `${indentation}px`);

    item.appendChild(link);
    fragment.appendChild(item);
    itemByHeading.set(titleInfo.element, item);
  }

  list.appendChild(fragment);
  list.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const link = event.target.closest("a");
    if (link && list.contains(link)) {
      setActiveItem(link.parentElement);
    }
  });

  nav.append(header, list);

  return { itemByHeading, nav };
};

const stopHeadingObserver = () => {
  headingObserver?.disconnect();
  headingObserver = null;
  visibleHeadings.clear();
};

const removeContents = () => {
  stopHeadingObserver();
  mountedToc?.remove();
  mountedToc = null;
  mountedSignature = "";
  mountedHeadings = [];
  setActiveItem(null);
};

const observeHeadings = (
  titles: TitleInfo[],
  itemByHeading: Map<HTMLElement, HTMLElement>,
) => {
  const selectHeading = (heading: HTMLElement) => {
    setActiveItem(itemByHeading.get(heading) ?? null);
  };

  const initialHeading =
    [...titles].reverse().find(({ element }) => element.getBoundingClientRect().top <= 96) ??
    titles[0];
  if (initialHeading) {
    selectHeading(initialHeading.element);
  }

  headingObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const heading = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          visibleHeadings.add(heading);
        } else {
          visibleHeadings.delete(heading);
        }
      }

      let visibleHeading: HTMLElement | null = null;
      let nearestTop = Number.POSITIVE_INFINITY;
      for (const heading of visibleHeadings) {
        const top = heading.getBoundingClientRect().top;
        if (top < nearestTop) {
          nearestTop = top;
          visibleHeading = heading;
        }
      }
      if (visibleHeading) {
        selectHeading(visibleHeading);
      }
    },
    { rootMargin: "-72px 0px -68% 0px" },
  );

  for (const { element } of titles) {
    headingObserver.observe(element);
  }
};

const getSignature = (titles: TitleInfo[]) =>
  titles.map(({ id, level, title }) => `${id}\u0000${level}\u0000${title}`).join("\u0001");

/**
 * Synchronize the table of contents with GitHub's client-rendered README.
 */
export const syncContents = () => {
  const readme = findElement(README_SELECTORS);
  const sidebar = findElement(SIDEBAR_SELECTORS);
  const titles = readme ? extractTitles(readme) : [];
  const signature = getSignature(titles);
  const headingElements = titles.map(({ element }) => element);
  const headingsUnchanged =
    headingElements.length === mountedHeadings.length &&
    headingElements.every((heading, index) => heading === mountedHeadings[index]);

  if (
    mountedToc?.isConnected &&
    readme === mountedReadme &&
    sidebar === mountedSidebar &&
    signature === mountedSignature &&
    headingsUnchanged
  ) {
    return;
  }

  removeContents();
  mountedReadme = readme;
  mountedSidebar = sidebar;

  if (!readme || !sidebar || !titles.length) {
    return;
  }

  const { itemByHeading, nav } = render(titles);
  sidebar.appendChild(nav);
  mountedToc = nav;
  mountedSignature = signature;
  mountedHeadings = headingElements;
  observeHeadings(titles, itemByHeading);
};

const containsRelevantElement = (node: Node) =>
  node instanceof Element &&
  (node.matches(RELEVANT_SELECTOR) || Boolean(node.querySelector(RELEVANT_SELECTOR)));

/**
 * Ignore unrelated GitHub UI mutations once the README and sidebar are mounted.
 */
export const shouldSyncContents = (mutations: MutationRecord[]) => {
  if (
    (mountedReadme && !mountedReadme.isConnected) ||
    (mountedSidebar && !mountedSidebar.isConnected) ||
    (mountedToc && !mountedToc.isConnected)
  ) {
    return true;
  }

  if (mountedReadme && mountedSidebar) {
    return mutations.some((mutation) => mountedReadme?.contains(mutation.target));
  }

  return mutations.some((mutation) => {
    if (mountedReadme?.contains(mutation.target)) {
      return true;
    }

    return [...mutation.addedNodes].some(containsRelevantElement);
  });
};
