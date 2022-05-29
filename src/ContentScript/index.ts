const getAbout = () => {
  const tag = document.querySelector(
    "div.BorderGrid-cell p"
  ) as HTMLParagraphElement;
  return tag?.innerText ?? "No data";
};
console.log("About: " + getAbout());

chrome.runtime.onMessage.addListener((_request, _sender, sendResponse) => {
  sendResponse(`About-Content: ${getAbout()}`);
});
