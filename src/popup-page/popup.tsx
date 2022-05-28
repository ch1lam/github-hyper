/*
 * @Description  :
 * @Author       : ch1lam
 * @Date         : 2022-05-28 17:53:33
 * @LastEditTime : 2022-05-28 18:49:06
 * @LastEditors  : chilam
 * @FilePath     : \github-hyper\src\popup-page\popup.tsx
 */
import React from "react";
import { createRoot } from "react-dom/client";

export const Popup = () => {
  return <div>Popup Page</div>;
};

const root = createRoot(document.getElementById("popup") as HTMLElement);
root.render(<Popup />);
