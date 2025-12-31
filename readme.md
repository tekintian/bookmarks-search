# 书签搜索 (Bookmarks Search)

一个功能强大的 Chrome 浏览器扩展，让您能够快速、高效地从工具栏按钮搜索和管理书签。

A powerful Chrome browser extension that allows you to quickly and efficiently search and manage bookmarks from the toolbar button.

## 📋 功能特性 | Features

### 🔍 搜索功能 | Search Functionality
- **增量搜索**：实时显示搜索结果，无需等待  
  **Incremental Search**: Real-time search results without waiting
- **多种搜索类型**：  
  **Multiple Search Types**:
  - 全部搜索：搜索所有书签标题和URL  
    All Search: Search all bookmark titles and URLs
  - 初始搜索：仅匹配以搜索词开头的书签  
    Initial Search: Only match bookmarks starting with the search term
  - 筛选搜索：在当前文件夹内筛选书签  
    Filter Search: Filter bookmarks within the current folder
- **搜索结果高亮**：清晰显示匹配的书签信息  
  **Search Result Highlighting**: Clearly display matching bookmark information

### 📁 书签管理 | Bookmark Management
- **文件夹浏览**：轻松浏览嵌套书签文件夹  
  **Folder Browsing**: Easily navigate nested bookmark folders
- **最近书签**：快速访问最近添加的20个书签  
  **Recent Bookmarks**: Quick access to the 20 most recently added bookmarks
- **右键菜单**：提供丰富的书签操作选项  
  **Right-click Menu**: Provides a variety of bookmark operation options
- **图标显示**：自动加载网站图标，提高辨识度  
  **Icon Display**: Automatically loads website icons for better recognition

### 🚀 快速操作 | Quick Operations
- **多种打开方式**：  
  **Multiple Opening Methods**:
  - 当前标签页  
    Current tab
  - 新标签页（可配置是否选中）  
    New tab (configurable selection)
  - 新窗口  
    New window
- **便捷功能**：  
  **Convenient Features**:
  - 重命名书签/文件夹  
    Rename bookmarks/folders
  - 删除书签/文件夹  
    Delete bookmarks/folders
  - 支持书签小工具 (Bookmarklet)  
    Support for bookmarklets
  - "打开并移除"：打开书签后自动删除  
    "Open and Remove": Automatically delete after opening a bookmark

### ⚙️ 配置选项 | Configuration Options
- **默认打开方式**：可自定义书签的默认打开行为  
  **Default Opening Method**: Customize the default opening behavior of bookmarks
- **搜索类型默认设置**：可配置默认的搜索类型  
  **Default Search Type**: Configure the default search type
- **国际化支持**：已支持中英文界面  
  **International Support**: Already supports Chinese and English interfaces

## 📦 安装方法 | Installation Methods

### 开发模式安装 | Development Mode Installation
1. 下载或克隆本项目到本地  
   Download or clone this project locally
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`  
   Open Chrome browser and visit `chrome://extensions/`
3. 开启右上角的"开发者模式"  
   Enable "Developer mode" in the top right corner
4. 点击"加载已解压的扩展程序"  
   Click "Load unpacked"
5. 选择项目文件夹，点击"选择"  
   Select the project folder and click "Select"
6. 扩展将自动安装并显示在工具栏中  
   The extension will be automatically installed and displayed in the toolbar

### 正式安装 | Official Installation
（如果有发布到 Chrome Web Store，可在此处提供链接）  
(If published to Chrome Web Store, provide a link here)

## 🚀 使用说明 | Usage Instructions

### 基本搜索 | Basic Search
1. 点击工具栏中的"书签搜索"图标  
   Click the "Bookmarks Search" icon in the toolbar
2. 在搜索框中输入关键词  
   Enter keywords in the search box
3. 实时查看搜索结果  
   View search results in real time
4. 点击结果即可打开对应书签  
   Click the result to open the corresponding bookmark

### 浏览文件夹 | Browse Folders
1. 点击工具栏中的"书签搜索"图标  
   Click the "Bookmarks Search" icon in the toolbar
2. 在初始界面浏览顶层书签和文件夹  
   Browse top-level bookmarks and folders on the initial interface
3. 点击文件夹可进入浏览其子书签  
   Click a folder to browse its sub-bookmarks
4. 点击"返回"按钮可回到上级文件夹  
   Click the "Back" button to return to the parent folder

### 右键菜单操作 | Right-click Menu Operations
1. 在书签列表中右键点击任意书签  
   Right-click any bookmark in the bookmark list
2. 在弹出的菜单中选择操作：  
   Select an operation from the pop-up menu:
   - **Open**：选择打开方式（Tab/Window/Incognito）  
     **Open**: Choose opening method (Tab/Window/Incognito)
   - **Action**：选择编辑或删除操作  
     **Action**: Choose edit or delete operations

### 编辑书签 | Edit Bookmarks
1. 右键点击书签，选择"Action" > "Edit"  
   Right-click the bookmark, select "Action" > "Edit"
2. 在弹出的对话框中修改标题和URL  
   Modify the title and URL in the pop-up dialog
3. 点击"Update"保存修改或"Cancel"取消  
   Click "Update" to save changes or "Cancel" to cancel

### 删除书签 | Delete Bookmarks
1. 右键点击书签，选择"Action" > "Remove"  
   Right-click the bookmark, select "Action" > "Remove"
2. 在确认对话框中点击"Remove"确认删除  
   Click "Remove" in the confirmation dialog to confirm deletion

## ⚙️ 配置选项 | Configuration Options

1. 右键点击工具栏中的扩展图标，选择"选项"  
   Right-click the extension icon in the toolbar and select "Options"
2. 在选项页面中配置：  
   Configure in the options page:
   - **Default Open to**：设置书签的默认打开方式  
     **Default Open to**: Set the default opening method for bookmarks
     - urrent：当前标签页  
       Current: Current tab
     - Tab：新标签页（未选中）  
       Tab: New tab (not selected)
     - Selected：新标签页（选中）  
       Selected: New tab (selected)
     - Window：新窗口  
       Window: New window
     - Flash：打开并移除  
       Flash: Open and remove

## 🛠️ 技术信息 | Technical Information

### 技术栈 | Technology Stack
- **Chrome Extension Manifest**: V3
- **前端框架**: jQuery 3.7.1  
  **Frontend Framework**: jQuery 3.7.1
- **UI组件**: jQuery UI 1.8.5  
  **UI Components**: jQuery UI 1.8.5
- **样式**: CSS3  
  **Styling**: CSS3

### 核心文件 | Core Files
- `manifest.json`: 扩展配置文件  
  `manifest.json`: Extension configuration file
- `popup.html/popup.js`: 主界面和功能逻辑  
  `popup.html/popup.js`: Main interface and functional logic
- `option.html/option.js`: 选项页面和配置逻辑  
  `option.html/option.js`: Options page and configuration logic
- `background.js`: 后台服务和消息处理  
  `background.js`: Background services and message handling
- `_locales/`: 国际化资源文件  
  `_locales/`: Internationalization resource files

### 权限说明 | Permission Description
- `tabs`: 访问和操作浏览器标签页  
  `tabs`: Access and manipulate browser tabs
- `bookmarks`: 访问和管理书签  
  `bookmarks`: Access and manage bookmarks
- `scripting`: 执行脚本（用于书签小工具）  
  `scripting`: Execute scripts (for bookmarklets)
- `<all_urls>`: 访问所有网站（用于加载网站图标）  
  `<all_urls>`: Access all websites (for loading website icons)

## GitHub Actions
https://github.com/tekintian/bookmarks-search



## 📝 更新日志 | Changelog

### v2.0.0
- 升级到 Chrome Extension Manifest V3  
  Upgraded to Chrome Extension Manifest V3
- 优化搜索性能  
  Optimized search performance
- 改进图标加载机制  
  Improved icon loading mechanism
- 增强右键菜单功能  
  Enhanced right-click menu functionality
- 修复已知问题  
  Fixed known issues

### v1.x.x
- 初始版本发布  
  Initial version release
- 支持基本搜索功能  
  Basic search functionality supported
- 支持文件夹浏览  
  Folder browsing supported
- 支持书签管理操作  
  Bookmark management operations supported

## 📄 许可证 | License

MIT License

## 🤝 贡献 | Contribution

欢迎提交 Issue 和 Pull Request 来帮助改进这个扩展！

Welcome to submit Issues and Pull Requests to help improve this extension!

## 📧 联系方式 | Contact

如有问题或建议，请通过以下方式联系：  
If you have any questions or suggestions, please contact us through:
- 项目地址：[GitHub Repository](https://github.com/tekintian/bookmarks-search)
- 邮箱：tekintian@gmail.com

---

**享受高效的书签管理体验！** 🎉  
**Enjoy efficient bookmark management!** 🎉
