// 主题样式配置
const themeStyles = {
  dark: {
    background: '#1a1b2e',      // 深蓝色背景
    text: '#ffffff',            // 白色文字
    link: '#58a6ff',           // 蓝色链接
    border: '#30363d',         // 深灰色边框
    code: {
      background: '#2d2d2d',   // 代码块背景
      text: '#e6e6e6'          // 代码文字颜色
    },
    table: {
      header: '#21262d',       // 表头背景
      row: '#1a1b2e',         // 行背景
      altRow: '#161b22',      // 交替行背景
      border: '#6e7681'       // 表格边框 - 更亮的灰色以提高对比度
    }
  },
  parchment: {
    background: '#f5e6d3',     // 羊皮纸背景
    text: '#2c1810',          // 深褐色文字
    link: '#8b4513',          // 棕色链接
    border: '#d4c4b7',        // 浅褐色边框
    code: {
      background: '#fff8dc',  // 米色代码块背景
      text: '#2c1810'         // 深褐色代码文字
    },
    table: {
      header: '#e8d5c0',     // 浅褐色表头
      row: '#f5e6d3',        // 羊皮纸色行背景
      altRow: '#f0dcc7',     // 稍深羊皮纸色交替行
      border: '#8b4513'      // 深褐色表格边框 - 使用链接色以提高对比度
    }
  },
  green: {
    background: '#e6efe6',     // 浅绿色背景
    text: '#1a3320',          // 深绿色文字
    link: '#2e7d32',          // 绿色链接
    border: '#c8e6c9',        // 浅绿色边框
    code: {
      background: '#f1f8e9',  // 极浅绿色代码块背景
      text: '#1a3320'         // 深绿色代码文字
    },
    table: {
      header: '#c8e6c9',     // 浅绿色表头
      row: '#e6efe6',        // 浅绿色行背景
      altRow: '#dbe7db',     // 稍深浅绿色交替行
      border: '#2e7d32'      // 深绿色表格边框，提高对比度
    }
  }
};

// 获取当前主题样式
function getCurrentThemeStyles() {
  const currentTheme = window.BetterAliyunDoc?.currentTheme;
  if (!currentTheme) {
    // 返回默认样式（不设置主题时的样式）
    return {
      background: '',
      text: '',
      link: '',
      border: '',
      code: {
        background: '',
        text: ''
      },
      table: {
        header: '',
        row: '',
        altRow: '',
        border: ''
      }
    };
  }
  return themeStyles[currentTheme];
}

// 应用样式到搜索结果
function applyDarkModeToSearchResults(container) {
  if (!container) return;
  const currentStyles = getCurrentThemeStyles();

  const elements = container.querySelectorAll('.search-result-item');
  elements.forEach((item) => {
    item.style.backgroundColor = currentStyles.background;
    item.style.color = currentStyles.text;

    const links = item.querySelectorAll('a');
    links.forEach((link) => {
      link.style.color = currentStyles.link;
    });
  });
}

// 应用样式到帮助文档内容
function applyDarkModeToHelpDocsContent(content) {
  if (!content) return;
  const currentStyles = getCurrentThemeStyles();

  content.style.backgroundColor = currentStyles.background;
  content.style.color = currentStyles.text;

  const links = content.querySelectorAll('a');
  links.forEach((link) => {
    link.style.color = currentStyles.link;
  });

  const codeBlocks = content.querySelectorAll('pre, code');
  codeBlocks.forEach((block) => {
    block.style.backgroundColor = currentStyles.code.background;
    block.style.color = currentStyles.code.text;
  });
}

// 应用样式到搜索结果
function applyDarkModeToMenuSearchResults() {
  const currentStyles = getCurrentThemeStyles();
  const searchContainers = document.querySelectorAll('div[class^="MenuSearch--resultContainer"]');
  searchContainers.forEach((container) => {
    container.style.backgroundColor = currentStyles.background;
    container.style.color = currentStyles.text;

    // 为所有子元素应用样式，确保文本颜色始终正确
    container.querySelectorAll('*').forEach((element) => {
      if (element.tagName.toLowerCase() !== 'a') {
        element.style.setProperty('color', currentStyles.text, 'important');
      }
      element.style.setProperty('background-color', currentStyles.background, 'important');
    });

    // 为链接应用特殊样式
    container.querySelectorAll('a').forEach((link) => {
      link.style.color = currentStyles.link;
    });
  });
}

// 应用样式到通知区域
function applyDarkModeToNoticeDivs() {
  const currentStyles = getCurrentThemeStyles();
  const noticeDivs = document.querySelectorAll('div[type="notice"]');
  noticeDivs.forEach((div) => {
    div.style.backgroundColor = currentStyles.background;
    div.style.color = currentStyles.text;
    div.style.borderColor = currentStyles.border;
  });
}

// 应用表格样式
function applyTableStyles(table) {
  if (!table) return;
  const currentStyles = getCurrentThemeStyles();

  table.style.borderColor = currentStyles.table.border;

  const headers = table.querySelectorAll('th');
  headers.forEach((header) => {
    header.style.backgroundColor = currentStyles.table.header;
    header.style.color = currentStyles.text;
    header.style.borderColor = currentStyles.table.border;
  });

  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    row.style.backgroundColor = index % 2 === 0 ? currentStyles.table.row : currentStyles.table.altRow;

    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      cell.style.borderColor = currentStyles.table.border;
      cell.style.color = currentStyles.text;
    });
  });
}

// 应用样式到特定的元素
function applyDarkModeToSpecificElements() {
  const currentStyles = getCurrentThemeStyles();

  // 应用样式到左侧边栏
  const leftSidebar = document.querySelector('.aliyun-docs-menu');
  if (leftSidebar) {
    leftSidebar.style.backgroundColor = currentStyles.background;
    leftSidebar.style.color = currentStyles.text;
    const leftChildElements = leftSidebar.querySelectorAll('*');
    leftChildElements.forEach((child) => {
      if (child.tagName.toLowerCase() !== 'a') {
        child.style.setProperty('color', currentStyles.text, 'important');
      }
      child.style.setProperty('background-color', currentStyles.background, 'important');
    });
  }

  // 应用样式到右侧边栏和正文
  const rightSidebar = document.querySelector('.aliyun-docs-view');
  if (rightSidebar) {
    rightSidebar.style.backgroundColor = currentStyles.background;
    rightSidebar.style.color = currentStyles.text;
    const rightChildElements = rightSidebar.querySelectorAll('*');
    rightChildElements.forEach((child) => {
      if (child.tagName.toLowerCase() !== 'a') {
        child.style.setProperty('color', currentStyles.text, 'important');
      }
      child.style.setProperty('background-color', currentStyles.background, 'important');
    });
  }

  // 应用样式到所有表格
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    table.style.backgroundColor = currentStyles.background;
    table.style.color = currentStyles.text;
    const tableChildElements = table.querySelectorAll('*');
    tableChildElements.forEach((child) => {
      if (child.tagName.toLowerCase() !== 'a') {
        child.style.setProperty('color', currentStyles.text, 'important');
      }
      child.style.setProperty('background-color', currentStyles.background, 'important');
    });
    applyTableStyles(table);
  });

  // 应用样式到 type="note" 的 div
  const noteDivs = document.querySelectorAll('div[type="note"]');
  noteDivs.forEach((div) => {
    div.style.backgroundColor = currentStyles.background;
    div.style.color = currentStyles.text;
    const noteChildElements = div.querySelectorAll('*');
    noteChildElements.forEach((child) => {
      if (child.tagName.toLowerCase() !== 'a') {
        child.style.setProperty('color', currentStyles.text, 'important');
      }
      child.style.setProperty('background-color', currentStyles.background, 'important');
    });
  });

  // 隐藏 header 和 footer
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  if (header) header.style.display = window.BetterAliyunDoc?.currentTheme ? 'none' : '';
  if (footer) footer.style.display = window.BetterAliyunDoc?.currentTheme ? 'none' : '';

  // 应用样式到 HelpBodyHead 开头的 div
  const helpBodyHeadDivs = document.querySelectorAll('div[class^="HelpBodyHead"]');
  helpBodyHeadDivs.forEach((div) => {
    div.style.backgroundColor = currentStyles.background;
    div.style.color = currentStyles.text;
    const childElements = div.querySelectorAll('*');
    childElements.forEach((child) => {
      if (child.tagName.toLowerCase() !== 'a') {
        child.style.setProperty('color', currentStyles.text, 'important');
      }
      child.style.setProperty('background-color', currentStyles.background, 'important');
    });
  });

  // 应用样式到搜索结果容器
  applyDarkModeToMenuSearchResults();
}

// 应用主题样式
function applyThemeStyles(theme) {
  window.BetterAliyunDoc = window.BetterAliyunDoc || {};
  window.BetterAliyunDoc.currentTheme = theme;

  let styleElement = document.getElementById('better-aliyun-doc-theme');

  // 如果没有设置主题，移除主题样式元素并重置所有样式
  if (!theme) {
    if (styleElement) {
      styleElement.remove();
    }
    // 清除所有应用的样式
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element) => {
      element.style.backgroundColor = '';
      element.style.color = '';
      element.style.borderColor = '';
    });
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.display = '';  // 恢复显示
    if (footer) footer.style.display = '';  // 恢复显示
    return;
  }

  // 创建或获取样式元素
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'better-aliyun-doc-theme';
    document.head.appendChild(styleElement);
  }

  const currentStyles = themeStyles[theme];
  styleElement.textContent = `
    body, body * {
      background-color: ${currentStyles.background} !important;
      color: ${currentStyles.text} !important;
    }
    
    /* Preserve link colors */
    a {
      color: ${currentStyles.link} !important;
    }
    div[class^="MenuSearch--resultContainer"] {
      background-color: ${currentStyles.background} !important;
      color: ${currentStyles.text} !important;
    }
    div[class^="MenuSearch--resultContainer"] * {
      background-color: ${currentStyles.background} !important;
      color: ${currentStyles.text} !important;
    }
    div[class^="MenuSearch--resultContainer"] a {
      color: ${currentStyles.link} !important;
    }
    .aliyun-docs-content, .aliyun-docs-content * {
      background-color: ${currentStyles.background} !important;
      color: ${currentStyles.text} !important;
    }
    .aliyun-docs-content h1,
    .aliyun-docs-content h2,
    .aliyun-docs-content h3,
    .aliyun-docs-content h4,
    .aliyun-docs-content h5,
    .aliyun-docs-content h6 {
      color: ${currentStyles.text} !important;
    }
    .aliyun-docs-content a {
      color: ${currentStyles.link} !important;
    }
    .aliyun-docs-content table {
      border-color: ${currentStyles.table.border} !important;
      border-width: ${theme === 'dark' ? '2px' : '1px'} !important;
    }
    .aliyun-docs-content th {
      background-color: ${currentStyles.table.header} !important;
      color: ${currentStyles.text} !important;
      border-color: ${currentStyles.table.border} !important;
      border-width: ${theme === 'dark' ? '2px' : '1px'} !important;
    }
    .aliyun-docs-content td {
      border-color: ${currentStyles.table.border} !important;
      border-width: ${theme === 'dark' ? '2px' : '1px'} !important;
    }
    .aliyun-docs-content code,
    .aliyun-docs-content pre {
      background-color: ${currentStyles.code.background} !important;
      color: ${currentStyles.code.text} !important;
    }
    .aliyun-docs-menu {
      background-color: ${currentStyles.background} !important;
      color: ${currentStyles.text} !important;
    }
    .aliyun-docs-side {
      background-color: ${currentStyles.background} !important;
      color: ${currentStyles.text} !important;
    }
    div[class^="HelpBodyHead"] {
      background-color: ${currentStyles.background} !important;
      color: ${currentStyles.text} !important;
    }
    div[class^="HelpBodyHead"] * {
      background-color: ${currentStyles.background} !important;
      color: ${currentStyles.text} !important;
    }
  `;

  applyDarkModeToSpecificElements();
}

// 设置深色模式观察器
function setupDarkModeObservers() {
  const searchResultObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {  // Element node
          // 检查是否是搜索结果容器或其子元素
          if (node.matches('div[class^="MenuSearch--resultContainer"]') ||
            node.querySelector('div[class^="MenuSearch--resultContainer"]')) {
            applyDarkModeToMenuSearchResults();
          }
          // 检查其他元素
          if (node.classList && node.classList.contains('search-result-item')) {
            applyDarkModeToSearchResults(node.parentElement);
          }
          if (node.classList && node.classList.contains('icms-help-docs-content')) {
            applyDarkModeToHelpDocsContent(node);
          }
        }
      });
    });
  });

  const content = document.querySelector('.aliyun-docs-view');
  if (content) {
    searchResultObserver.observe(content, { childList: true, subtree: true });
  }
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'changeTheme') {
    applyThemeStyles(message.theme);
    sendResponse({ success: true });
  }
});

// 初始化主题
async function initializeTheme() {
  const { theme } = await chrome.storage.local.get('theme');
  applyThemeStyles(theme || null);
}

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.theme = {
  applyThemeStyles,
  getCurrentThemeStyles,
  styles: themeStyles
};

// 初始化
console.log('[BetterAliyunDoc] Theme module loading');
initializeTheme();
setupDarkModeObservers();
console.log('[BetterAliyunDoc] Theme module loaded');
