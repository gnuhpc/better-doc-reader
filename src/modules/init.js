// 初始化 BetterAliyunDoc 命名空间
window.BetterAliyunDoc = window.BetterAliyunDoc || {};

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
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const MAX_ATTEMPTS = 50; // 5 seconds maximum

      const checkModules = () => {
        const modules = [
          'notes',
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

  _initializeModules: async function() {
    // 获取内容区域的实际宽度
    const contentElement = document.querySelector('.aliyun-docs-content');
    if (contentElement) {
      const contentWidth = (contentElement.offsetWidth / window.innerWidth) * 100;
      window.__betterAliyunDoc.contentWidth = Math.round(contentWidth);
      console.log('[BetterAliyunDoc] Content width initialized to:', window.__betterAliyunDoc.contentWidth + '%');
    } else {
      window.__betterAliyunDoc.contentWidth = 70; // Fallback to default if element not found
      console.log('[BetterAliyunDoc] Content element not found, using default width');
    }

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

    // 防止重复初始化
    if (window.__betterAliyunDoc.initialized) {
      console.log('[BetterAliyunDoc] Already initialized, skipping');
      return;
    }

    const init = () => this._initializeModules();

    // 确保 DOM 已准备就绪
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    // 也在 load 事件时尝试初始化，以防 DOMContentLoaded 已经错过
    window.addEventListener('load', () => {
      if (!window.__betterAliyunDoc.initialized) {
        init();
      }
    });
  }
};
