# Github Hyper

![Github Hyper Banner](https://user-images.githubusercontent.com/39334548/173551041-0aec28df-3b70-451d-becf-4b882129b799.png)

<p align=center>
一款提升github用户体验的插件。
</p>

<br>

<p align=center>
<a href="https://github.com/ch1lam/github-hyper#github-hyper">English</a> • <b>简体中文</b>
</p>

<br>

## 功能特性

- ⚡ 轻量化脚本
- 🔝 返回顶部按钮
- 📇 Readme 目录

## 安装说明

### Edge

> 在 Edge Add-ons 中下载或按下列说明步骤操作

1. 点击 [releases](https://github.com/ch1lam/github-hyper/releases) 下载 `github-hyper-edge.zip` 最新版
2. 解压文件
3. 打开 Edge 浏览器
4. 在地址栏中输入 `edge://extensions`
5. 在左侧栏中点击启用 `开发人员模式`
6. 点击页面顶部的 `加载解压缩的扩展`
7. 找到并选择已解压文件，扩展将安装完成
8. 为了固定扩展, 可以点击 Edge 浏览器右上角的`拼图图标`，并选择`在工具栏中显示`

### Chrome

1. 点击 [releases](https://github.com/ch1lam/github-hyper/releases) 下载 `github-hyper-chrome.zip` 最新版
2. 解压文件
3. 打开 Chrome 浏览器
4. 在地址栏中输入 `edge://extensions`
5. 点击并启用右侧顶栏中的 `开发者模式`
6. 点击左侧顶栏中的 `加载已解压的扩展程序`
7. 找到并选择已解压文件，扩展将安装完成
8. 为了固定扩展, 可以点击 Chrome 浏览器右上角的`拼图图标`，并选择`图钉图标`

## 报告问题、错误和功能请求

请在 issue 页面中报告遇到的问题，或提出你想要的新功能。在你提交 issue 以后我们会尽快回复你。同时，在 issue 页中你也可以看到一个开放的问题列表，你可以通过评论来帮助别人解决难题，或发起一个 PR，详细见贡献部分。

## 如何参与贡献

我们欢迎任何人通过提交 PR（Pull Request）来为这个项目做出贡献，我们会很高兴地将其合并，并为使用这个扩展的人们提供功能和修复。

### 开发

1. 克隆项目
2. 在 vscode 中打开项目，或者其他你最喜爱的编辑器
3. 在命令行中运行 `pnpm` 安装依赖
4. 在命令行中运行 `pnpm dev` 去构建开发环境版本

### 打包.crx 文件

1. 在命令行中运行 `pnpm build` 构建生产环境版本
2. 打开 Edge 或 Chrome
3. 在地址栏中输入`edge://extensions`或`chrome://extensions`
4. 点击 `打包扩展`
5. 选择 `/github-hyper/dist`目录并点击`打包扩展`
