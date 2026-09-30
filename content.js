(function() {
  // 初始化全局对象
  window.BetterAliyunDoc = window.BetterAliyunDoc || {};

  // 严格检查是否为阿里云官方文档页面（排除控制台、账号中心等）
  function isDocPage() {
    if (window.BetterAliyunDoc?.isDocumentationPage) {
      return window.BetterAliyunDoc.isDocumentationPage();
    }
    const hostname = (window.location.hostname || '').toLowerCase();
    const pathname = (window.location.pathname || '').toLowerCase();
    if (hostname.includes('console') || pathname.includes('/console/')) {
      return false;
    }
    return (
      hostname === 'help.aliyun.com' ||
      hostname === 'help.alibabacloud.com' ||
      pathname.startsWith('/help') ||
      pathname.startsWith('/document_detail')
    );
  }

  if (!isDocPage()) {
    return;
  }

  // 初始化函数
  function initializeModules() {
    if (!isDocPage()) {
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

  // 极速路径：在 document_start 立即启动 MutationObserver，正文元素一旦插入 DOM 立即触发初始化
  let initTimer = null;
  const triggerInitFast = () => {
    if (document.querySelector('.aliyun-docs-content')) {
      if (initTimer) window.clearTimeout(initTimer);
      initTimer = window.setTimeout(initializeModules, 0);
    }
  };

  const observer = new MutationObserver((mutations) => {
    const hasContent = mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some((node) =>
        node.nodeType === window.Node.ELEMENT_NODE &&
        (node.matches?.('.aliyun-docs-content') ||
         node.querySelector?.('.aliyun-docs-content'))
      )
    );
    if (hasContent) {
      triggerInitFast();
    }
  });

  // 在 documentElement 上观察，覆盖 document_start 到 DOMContentLoaded 的所有节点插入
  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // 检查当前是否已经存在内容元素
  if (document.querySelector('.aliyun-docs-content')) {
    triggerInitFast();
  }

  // DOMContentLoaded 与 load 兜底
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.setTimeout(initializeModules, 0);
    }, { once: true });
  } else {
    window.setTimeout(initializeModules, 0);
  }

  window.addEventListener('load', () => {
    window.setTimeout(initializeModules, 0);
  }, { once: true });

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
    } else if (message.command === 'toggle-view') {
      if (window.BetterAliyunDoc && window.BetterAliyunDoc.content) {
        window.BetterAliyunDoc.content.toggleContent();
        sendResponse({ success: true, isContentOnly: !!window.__betterAliyunDoc?.isContentOnly });
      } else {
        sendResponse({ success: false, error: 'Content module not loaded' });
      }
    } else if (message.action === 'getPageState') {
      sendResponse({
        success: true,
        isContentOnly: !!window.__betterAliyunDoc?.isContentOnly,
        contentWidth: window.__betterAliyunDoc?.contentWidth
      });
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
    } else if (message.command === 'reset-layout' || message.action === 'resetLayout') {
      if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
        window.BetterAliyunDoc.layout.resetToOfficialLayout();
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Layout module not loaded' });
      }
    }
    return true;
  });
})();
