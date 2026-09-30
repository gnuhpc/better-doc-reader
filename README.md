# Better Doc Reader

A Chrome extension that enhances the reading experience of technical documentation by providing a clean, content-focused view and productivity utilities.

## Author

gnuhpc

## Features

- **Content-Focused Reading (`Alt + F`)**: Switch seamlessly between the standard documentation layout and a distraction-free, full-width content view. In content-only mode, hover your mouse near the left edge to reveal the product menu drawer, or near the right edge to slide out the in-page outline drawer for smooth jump navigation.
- **Multiple Reading Themes**: Cycle through comfortable themes with `Alt + D`:
  - 🌙 **Dark Mode**: Comfortable high-contrast dark palette for low light
  - 🍃 **Eye-care Green**: Soft green hue designed for long reading sessions
  - 📜 **Parchment**: Warm retro paper texture
  - ☀️ **Default**: Original documentation theme
- **Intelligent Sidebar Management**:
  - Collapse / restore the left navigation tree (`Alt + L` or `Option + [`)
  - Collapse / restore the right table of contents (`Alt + R` or `Option + ]`), automatically expanding main content to 100% width
- **Content Area Width Adjustment**:
  - Narrow content width (`Alt + Left`)
  - Widen content width (`Alt + Right`)
- **Quick Note-Taking**:
  - Select text on any doc page to immediately bookmark or take notes
  - Browse and delete saved notes categorized by article directly within the extension popup
  - One-click export all notes as Markdown (`.md`)
  - Notes automatically sync across devices via Chrome account sync
- **Automatic Site Detection**: Automatically detects compatible documentation pages:
  - 🔴 Red dot badge when visiting supported documentation
  - 🟢 Green badge when in content-only view
- **Supported Platforms**:
  - Alibaba Cloud Documentation (`help.aliyun.com`)
  - Alibaba Cloud International (`www.alibabacloud.com/help`)

---

### 更好的文档阅读器 (Better Doc Reader)

### 特性

- **专注阅读模式（`Alt + F`）**：一键在官方完整页面与去干扰纯内容模式之间平滑切换。在纯享模式下，鼠标轻移至屏幕左侧边缘即可呼出浮动产品目录抽屉，移动至右侧边缘即可呼出页内跳转大纲抽屉，点击小节标题可平滑定位跳转。
- **多款护眼主题**：按 `Alt + D` 循环切换阅读主题：
  - 🌙 **深色模式**：高对比度暗黑风格，夜间阅读不伤眼
  - 🍃 **护眼绿**：柔和淡绿底色，缓解长时间阅读疲劳
  - 📜 **羊皮纸复古**：温暖纸质阅读质感
  - ☀️ **默认主题**：恢复文档原始配色
- **智能侧边栏收起/恢复**：
  - 收起/恢复左侧导航菜单（`Alt + L` 或 Mac 上的 `Option + [`）
  - 收起/恢复右侧目录大纲（`Alt + R` 或 Mac 上的 `Option + ]`），正文自动平滑伸展占满屏幕
- **正文宽度精细调整**：
  - 缩小正文宽度（`Alt + Left`）
  - 扩大正文宽度（`Alt + Right`）
- **划词快捷笔记**：
  - 选中文本自动浮现“保存笔记”按钮，快速记录重点
  - 点击扩展图标弹窗，按文档页面结构分类查看、折叠与删除笔记
  - 支持一键导出所有笔记为标准 Markdown（`.md`）文件
  - 依托 Chrome 账号实现多端浏览器自动云同步
- **智能页面检测**：
  - 🔴 访问支持的文档页面时，扩展图标显示红点标记
  - 🟢 切换为仅内容模式后，扩展图标变为绿色激活状态
- **全面支持站点**：
  - 阿里云中国站帮助中心（`help.aliyun.com`）
  - 阿里云国际站帮助文档（`www.alibabacloud.com/help`）

---

## Installation / 安装方式

### Method 1: From Chrome Web Store / Chrome 应用商店安装
1. Visit the Chrome Web Store.
2. Search for "Better Doc Reader".
3. Click "Add to Chrome".

### Method 2: Manual Installation / 开发者模式手动安装
1. Clone this repository or download `better-doc.zip` from Releases and extract it.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right.
4. Click "Load unpacked" (加载已解压的扩展程序).
5. Select the repository root directory or the extracted extension directory.

---

## Keyboard Shortcuts / 快捷键一览

| Action / 功能 | Shortcut (Windows/Linux) | Shortcut (macOS) | Description / 说明 |
| :--- | :--- | :--- | :--- |
| **切换仅内容视图** | `Alt + F` | `Option + F` | 或在弹窗中点击“切换仅内容” |
| **切换阅读主题** | `Alt + D` | `Option + D` | 默认 ➔ 深色 ➔ 护眼绿 ➔ 羊皮纸 |
| **收起/恢复左侧栏** | `Alt + L` | `Option + L` 或 `Option + [` | 收起/展开左侧导航目录 |
| **收起/恢复右侧栏** | `Alt + R` | `Option + R` 或 `Option + ]` | 收起/展开右侧大纲并撑满正文 |
| **缩小正文宽度** | `Alt + Left` | `Option + Left` | 减小正文容器宽度 |
| **扩大正文宽度** | `Alt + Right` | `Option + Right` | 增加正文容器宽度 |

> **提示**：如需自定义以上快捷键，可在 Chrome 浏览器中访问 `chrome://extensions/shortcuts` 进行自由配置。

---

## Privacy Policy / 隐私说明

This extension runs completely client-side in your browser. It does not collect, track, or transmit any user data to any external server. Saved notes are stored locally and synced only via your official Google Chrome sync account.

本扩展完全在本地浏览器中运行，不采集、不追踪且不向任何第三方服务器上传任何用户数据。保存的笔记仅保存在本地并通过 Google 官方 Chrome 同步服务在您的授权设备间同步。

## License

MIT
