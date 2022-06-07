interface TitleInfo {
  id: string;
  title: string;
  level: number;
  nodeName: string;
}

const titleTag = ["H1", "H2", "H3", "H4", "H5", "H6"];
const titles: TitleInfo[] = [];

/**
 * Crawl title tags
 */
const article = document.querySelector("readme-toc article");

/**
 * Traversing articles and package header labels
 */
const traverseArticle = () => {
  if (!article) {
    return;
  }
  Array.from(article.children).forEach((e, _index) => {
    if (titleTag.includes(e.nodeName)) {
      titles.push({
        id: e.firstElementChild!.id,
        title: e.textContent!,
        level: Number(e.nodeName.substring(1, 2)),
        nodeName: e.nodeName,
      });
    }
  });
};

/**
 * Component rendering style
 */
const render = (titles: TitleInfo[]) => {
  let str: string = "";
  const contents: HTMLUListElement = document.createElement("ul");

  contents.id = "table-of-contents";

  titles.map((titleInfo, index) => {
    str +=
      "<li>" +
      "<a href='#" +
      titleInfo.id +
      "'>" +
      titleInfo.title +
      "</a></li>";
  });

  contents.innerHTML = str;
  return contents;
};

/**
 * create table of contents
 */
const createContents = () => {
  traverseArticle();
  const tag = document.querySelector("div.BorderGrid.BorderGrid--spacious");
  if (!tag) {
    return;
  }
  render(titles);
  tag.insertAdjacentElement("beforeend", render(titles));
};

export default createContents;
