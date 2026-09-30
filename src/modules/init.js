// 判断当前是否为阿里云官方文档页面（严格排除控制台、账号、购买等后台页面）
function isDocumentationPage(url = window.location) {
  try {
    const hostname = (url.hostname || '').toLowerCase();
    const pathname = (url.pathname || '').toLowerCase();

    // 1. 严格排除各类控制台与内部后台系统（如 realtime-compute.console.aliyun.com 等）
    if (
      hostname.includes('console') ||
      hostname.includes('dashboard') ||
      hostname.includes('usercenter') ||
      hostname.includes('account') ||
      hostname.includes('signin') ||
      hostname.includes('login') ||
      hostname.includes('buy') ||
      hostname.includes('workorder') ||
      pathname.includes('/console/')
    ) {
      return false;
    }

    // 2. 确认是阿里云相关域名
    const isAliyun =
      hostname.endsWith('.aliyun.com') ||
      hostname === 'aliyun.com' ||
      hostname.endsWith('.alibabacloud.com') ||
      hostname === 'alibabacloud.com';
    if (!isAliyun) {
      return false;
    }

    // 3. 必须是明确的文档站点或文档路径
    if (hostname === 'help.aliyun.com' || hostname === 'help.alibabacloud.com') {
      return true;
    }

    if (pathname.startsWith('/help') || pathname.startsWith('/document_detail')) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

// 在 document_start 阶段同步读取配置并预置抗闪烁样式与属性（仅针对文档页面）
(function applyEarlyPreferences() {
  try {
    if (typeof window === 'undefined' || !isDocumentationPage()) {
      return;
    }

    const docEl = document.documentElement;
    if (!docEl) return;

    const isContentOnly = window.localStorage?.getItem('better_doc_reader_isContentOnly') === 'true';
    const theme = window.localStorage?.getItem('better_doc_reader_theme');

    if (theme) {
      docEl.setAttribute('data-bad-theme', theme);
    }

    if (isContentOnly) {
      docEl.setAttribute('data-bad-content-only', 'true');
    }

    if ((isContentOnly || theme) && !document.getElementById('betterAliyunDoc-anti-flicker')) {
      const antiFlickerStyle = document.createElement('style');
      antiFlickerStyle.id = 'betterAliyunDoc-anti-flicker';
      antiFlickerStyle.textContent = `
        /* 纯享模式防闪烁：在正文克隆与挂载完成前，隐藏官方原始页面元素，防止左右面板在加载时一闪而过 */
        html[data-bad-content-only="true"] body > *:not(#betterAliyunDoc-content-only):not([class*="bad-drawer"]):not([id*="betterAliyunDoc-"]) {
          display: none !important;
        }
        /* 主题模式防闪烁底色：防止页面加载初期白屏闪烁 */
        html[data-bad-theme="dark"], html[data-bad-theme="dark"] body {
          background-color: #1a1b2e !important;
          color: #ffffff !important;
        }
        html[data-bad-theme="parchment"], html[data-bad-theme="parchment"] body {
          background-color: #f5e6d3 !important;
        }
        html[data-bad-theme="green"], html[data-bad-theme="green"] body {
          background-color: #e6efe6 !important;
        }
      `;
      docEl.appendChild(antiFlickerStyle);
    }
  } catch (e) {
    // 忽略异常，确保不中断后续执行
  }
})();

// 安全兜底：如果2.5秒后仍未找到正文容器，移除防闪烁属性，防止非正文页面处于隐藏状态
window.setTimeout(() => {
  if (document.documentElement?.getAttribute('data-bad-content-only') === 'true') {
    if (!document.getElementById('betterAliyunDoc-content-only') && !document.querySelector('.aliyun-docs-content')) {
      console.log('[BetterAliyunDoc] Content container not found, removing anti-flicker attribute');
      document.documentElement.removeAttribute('data-bad-content-only');
    }
  }
}, 2500);

// 初始化 BetterAliyunDoc 命名空间
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.isDocumentationPage = isDocumentationPage;

// 初始化全局对象
window.__betterAliyunDoc = window.__betterAliyunDoc || {
  initialized: false,
  isContentOnly: false,
  isDarkMode: false,
  isWideContent: false,
  originalHTML: null,
  originalStyles: null,
  contentWidth: null // Will be set during initialization
};

// 定义初始化模块
window.BetterAliyunDoc.init = {
  initializeGlobalState: function() {
    console.log('[BetterAliyunDoc] Initializing global state');
    // 已经在顶部初始化了，这里只记录日志
    console.log('[BetterAliyunDoc] Global state initialized:', window.__betterAliyunDoc);
  },

  _ensureModulesLoaded: function() {
    return new Promise((resolve) => {
      let attempts = 0;
      const MAX_ATTEMPTS = 50; // 5 seconds maximum

      const checkModules = () => {
        const modules = [
          'notes',
          'settings',
          'layout',
          'keyboard',
          'content',
          'theme'
        ];

        const allLoaded = modules.every((module) =>
          window.BetterAliyunDoc && window.BetterAliyunDoc[module]
        );

        if (allLoaded) {
          console.debug('[BetterAliyunDoc] All modules loaded');
          resolve();
        } else if (attempts >= MAX_ATTEMPTS) {
          console.debug('[BetterAliyunDoc] Module loading timed out, continuing anyway');
          resolve();
        } else {
          attempts++;
          console.debug('[BetterAliyunDoc] Waiting for modules to load... Attempt:', attempts);
          window.setTimeout(checkModules, 100);
        }
      };

      checkModules();
    });
  },

  _disableAllModules: function() {
    window.BetterAliyunDoc.keyboard = null;
    window.BetterAliyunDoc.notes = null;
    window.BetterAliyunDoc.layout = null;
    window.BetterAliyunDoc.content = null;
    window.BetterAliyunDoc.theme = null;
    window.BetterAliyunDoc.settings = null;
    window.__betterAliyunDoc.initialized = true;
  },

  _initializeModules: async function() {
    const contentElement = document.querySelector('.aliyun-docs-content');
    if (contentElement && contentElement.offsetWidth > 0) {
      const contentWidth = (contentElement.offsetWidth / window.innerWidth) * 100;
      window.__betterAliyunDoc.contentWidth = Math.round(contentWidth);
    } else if (!window.__betterAliyunDoc.contentWidth) {
      window.__betterAliyunDoc.contentWidth = 70;
    }
    console.log('[BetterAliyunDoc] Content width initialized to:', window.__betterAliyunDoc.contentWidth + '%');

    // 初始化全局状态
    this.initializeGlobalState();

    // 等待所有模块加载完成
    try {
      await this._ensureModulesLoaded();

      // 初始化各模块
      if (window.BetterAliyunDoc.notes) {
        console.debug('[BetterAliyunDoc] Initializing notes module');
        window.BetterAliyunDoc.notes.init();
      }

      if (window.BetterAliyunDoc.layout) {
        console.debug('[BetterAliyunDoc] Layout module ready');
      }

      if (window.BetterAliyunDoc.keyboard) {
        console.debug('[BetterAliyunDoc] Keyboard module ready');
      }

      if (window.BetterAliyunDoc.content) {
        console.debug('[BetterAliyunDoc] Content module ready');
      }

      // 标记为已初始化
      window.__betterAliyunDoc.initialized = true;
      console.log('[BetterAliyunDoc] All modules initialized');

      // 自动恢复上次保存的页面布局设置（纯享模式/主题/侧边栏状态/正文宽度）
      if (window.BetterAliyunDoc.settings) {
        window.BetterAliyunDoc.settings.restorePageSettings();
      }
    } catch (error) {
      console.error('[BetterAliyunDoc] Error during module initialization:', error);
      // Still try to initialize notes module even if other modules fail
      if (window.BetterAliyunDoc.notes) {
        window.BetterAliyunDoc.notes.init();
      }
    }
  },

  initializeBetterAliyunDoc: function() {
    console.log('[BetterAliyunDoc] Initializing...');

    // 检查URL是否匹配官方文档（严格排除控制台）
    if (!isDocumentationPage()) {
      console.log('[BetterAliyunDoc] Not a documentation page, initialization aborted');
      this._disableAllModules();
      return;
    }

    // 防止重复初始化
    if (window.__betterAliyunDoc.initialized) {
      console.log('[BetterAliyunDoc] Already initialized, skipping');
      return;
    }

    // 检查是否为阿里云文档页面
    const contentElement = document.querySelector('.aliyun-docs-content');
    if (!contentElement) {
      console.log('[BetterAliyunDoc] Content element not found yet, waiting for DOM updates');
      return;
    }

    const init = () => this._initializeModules();

    // 只要正文元素已在 DOM 中且 body 存在，即可直接执行初始化，无需等待耗时的外部资源加载
    if (document.body) {
      init();
    } else {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    }
  }
};
