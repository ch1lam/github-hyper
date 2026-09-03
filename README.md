# Github Hyper

![Github Hyper Banner](https://user-images.githubusercontent.com/39334548/173551041-0aec28df-3b70-451d-becf-4b882129b799.png)

<p align=center>
Chrome/Edge (MV3) extension to enhance the GitHub user experience.
</p>

<br>

<p align=center>
<b>English</b> • <a href="https://github.com/ch1lam/github-hyper/blob/master/README-zh.md">简体中文</a>
</p>

<br>

## Features

- ⚡ Lightweight script
- 🔝 Back to top button
- 📇 README table of contents (sticky while scrolling, with active-heading highlight)

## Installation Instructions

### Edge

> Download via Edge Add-ons or follow the instructions below

1. Download the latest [github-hyper-edge.zip](https://github.com/ch1lam/github-hyper/releases/latest/download/github-hyper-edge.zip) release
2. Extract the file
3. Open Edge
4. Enter `edge://extensions` in the address bar
5. Enable `developer mode` with the toggle on the left side of the page if it is not enabled already
6. Click `load unpacked` on the left side of the page
7. Find and select the extracted folder, this extension should now be installed
8. To pin the extension, click the `puzzle icon` on the top right of Edge, then `pin the extension`

### Chrome

1. Download the latest [github-hyper-chrome.zip](https://github.com/ch1lam/github-hyper/releases/latest/download/github-hyper-chrome.zip) release
2. Extract the file
3. Open Chrome
4. Enter `chrome://extensions` in the address bar
5. Enable `developer mode` with the toggle on the top right side of the page if it is not enabled already
6. Click `load unpacked` on the top side of the page
7. Find and select the extracted folder, this extension should now be installed
8. To pin the extension, click the `puzzle icon` on the top right of Chrome, then `pin the extension`

## Reporting Issues, bugs and feature request

Visit the issues page to report, bugs or tell us about a feature you would like to see and hopefully we will get to you. Kindly allow for some time after submitting a issue for someone to get back to you. You can also see a list of open issues that you may contribute to by commenting to help out someone with a challenge or developing and opening a PR. See contribution section.

## How to Contribute

Anyone is welcome to provide contributions to this project by submitting a PR (Pull Request) and it will be happily merged to provide features and fixes to the incredible people using the extension.

### Development

1. Clone the project
2. Open in VS Code or your favourite editor
3. Run `pnpm install` to install dependencies
4. Run `pnpm dev` to build the development version

### Package .crx

1. Run `pnpm build` to build the production version
2. Open Edge or Chrome
3. Enter `edge://extensions` or `chrome://extensions`
4. Click `Pack extension`
5. Choose `/github-hyper/dist` and click `Pack extension`

Pushing a tag that matches the extension version, such as `v0.6.5`, automatically builds both browser ZIP packages and publishes a GitHub Release.
