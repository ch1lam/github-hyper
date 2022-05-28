/*
 * @Description  :
 * @Author       : ch1lam
 * @Date         : 2022-05-28 19:54:56
 * @LastEditTime : 2022-05-28 21:45:07
 * @LastEditors  : chilam
 * @FilePath     : \github-hyper\src\contentScript.ts
 */
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
