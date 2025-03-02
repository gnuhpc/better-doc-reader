// 初始化全局对象
window.BetterAliyunDoc = window.BetterAliyunDoc || {};

// 初始化函数
function initializeModules() {
  if (!window.location.hostname.includes('aliyun.com')) {
    return;
  }

  // 初始化扩展
  if (window.BetterAliyunDoc && window.BetterAliyunDoc.init) {
    window.BetterAliyunDoc.init.initializeBetterAliyunDoc();
  } else {
    console.error('[BetterAliyunDoc] Init module not loaded');
  }

  // Notes module is self-initializing
  if (!window.BetterAliyunDoc || !window.BetterAliyunDoc.notes) {
    console.error('[BetterAliyunDoc] Notes module not loaded');
  }

  // 检查键盘和布局模块
  window.BetterAliyunDoc?.keyboard && window.BetterAliyunDoc?.layout;

  // 检查页面是否可以被提取
  if (window.BetterAliyunDoc && window.BetterAliyunDoc.content) {
    window.BetterAliyunDoc.content.checkPage();
  }
}

// 监听 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  window.setTimeout(initializeModules, 0);

  // 设置 MutationObserver 监听 DOM 变化
  const observer = new MutationObserver((mutations) => {
    const contentChanged = mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some((node) =>
        node.nodeType === window.Node.ELEMENT_NODE &&
        (node.matches?.('.aliyun-docs-content') ||
         node.querySelector?.('.aliyun-docs-content'))
      )
    );

    if (contentChanged) {
      window.setTimeout(initializeModules, 100);
    }
  });

  // 开始观察 DOM 变化
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});

// 监听页面完全加载
window.addEventListener('load', () => {
  window.setTimeout(initializeModules, 0);
});

// 监听来自 background script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.command === 'toggle-dark-mode' || message.action === 'changeTheme') {
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.theme) {
      if (message.theme) {
        window.BetterAliyunDoc.theme.applyThemeStyles(message.theme);
      }
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Theme module not loaded' });
    }
  } else if (message.command === 'toggle-view' && message.source === 'keyboard') {
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.content) {
      window.BetterAliyunDoc.content.toggleContent();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Content module not loaded' });
    }
  } else if (message.action === 'toggleLeftSidebar') {
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
      window.BetterAliyunDoc.layout.toggleLeftSidebar();
    }
    sendResponse({ success: true });
  } else if (message.action === 'toggleRightSidebar') {
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
      window.BetterAliyunDoc.layout.toggleRightSidebar();
    }
    sendResponse({ success: true });
  } else if (message.command === 'collapse-left-sidebar') {
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
      window.BetterAliyunDoc.layout.collapseLeftSidebar();
    }
    sendResponse({ success: true });
  } else if (message.command === 'collapse-right-sidebar') {
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
      window.BetterAliyunDoc.layout.collapseRightSidebar();
    }
    sendResponse({ success: true });
  } else if (message.command === 'widen-content') {
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
      window.BetterAliyunDoc.layout.adjustSidebars('wide');
    }
    sendResponse({ status: 'success' });
  } else if (message.command === 'narrow-content') {
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
      window.BetterAliyunDoc.layout.adjustSidebars('narrow');
    }
    sendResponse({ status: 'success' });
  }
  return true;
});
