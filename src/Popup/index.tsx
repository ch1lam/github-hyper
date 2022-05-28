/*
 * @Description  :
 * @Author       : ch1lam
 * @Date         : 2022-05-28 17:53:33
 * @LastEditTime : 2022-05-28 21:41:15
 * @LastEditors  : chilam
 * @FilePath     : \github-hyper\src\popup-page\popup.tsx
 */
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

export const Popup = () => {
  const [content, setContent] = useState("N/A");

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabId = tabs.length === 0 ? 0 : tabs[0].id!;
      chrome.tabs.sendMessage(currentTabId, "", (response) => {
        setContent(response);
      });
    });
  }, [content]);

  return <div>{content}</div>;
};

const root = createRoot(document.getElementById("popup") as HTMLElement);
root.render(<Popup />);
