// 设置管理模块：跨页面记忆用户页面设置，并在打开新文档时自动应用
(function() {
  const SETTINGS_KEY = 'better_doc_reader_settings';

  const defaultSettings = {
    isContentOnly: false,
    currentTheme: null, // null | 'dark' | 'green' | 'parchment'
    leftCollapsed: false,
    rightCollapsed: false,
    contentWidth: null
  };

  // 获取存储实例（优先 sync，降级 local，再降级 localStorage）
  function getStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      return {
        get: (key) => new Promise((resolve) => {
          chrome.storage.sync.get([key], (res) => resolve(res[key]));
        }),
        set: (key, val) => new Promise((resolve) => {
          chrome.storage.sync.set({ [key]: val }, () => resolve());
        })
      };
    } else if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return {
        get: (key) => new Promise((resolve) => {
          chrome.storage.local.get([key], (res) => resolve(res[key]));
        }),
        set: (key, val) => new Promise((resolve) => {
          chrome.storage.local.set({ [key]: val }, () => resolve());
        })
      };
    } else {
      return {
        get: (key) => Promise.resolve(JSON.parse(window.localStorage?.getItem(key) || 'null')),
        set: (key, val) => Promise.resolve(window.localStorage?.setItem(key, JSON.stringify(val)))
      };
    }
  }

  // 加载已保存设置
  async function loadSettings() {
    try {
      const storage = getStorage();
      const saved = await storage.get(SETTINGS_KEY);
      return { ...defaultSettings, ...(saved || {}) };
    } catch (e) {
      console.warn('[BetterAliyunDoc] Failed to load settings:', e);
      return { ...defaultSettings };
    }
  }

  // 保存部分设置（带轻度防抖）
  let saveTimer = null;
  let pendingSettings = {};
  function saveSetting(key, val) {
    pendingSettings[key] = val;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(async () => {
      try {
        const storage = getStorage();
        const current = await loadSettings();
        const updated = { ...current, ...pendingSettings };
        pendingSettings = {};
        await storage.set(SETTINGS_KEY, updated);
        console.debug('[BetterAliyunDoc] Settings saved:', updated);
      } catch (e) {
        console.warn('[BetterAliyunDoc] Failed to save settings:', e);
      }
    }, 150);
  }

  // 重置设置为默认官方设置
  async function resetSettings() {
    try {
      const storage = getStorage();
      pendingSettings = {};
      await storage.set(SETTINGS_KEY, { ...defaultSettings });
      console.log('[BetterAliyunDoc] Settings reset to default in storage');
    } catch (e) {
      console.warn('[BetterAliyunDoc] Failed to reset settings:', e);
    }
  }

  // 恢复并应用已保存设置到当前文档页面
  async function restorePageSettings() {
    const settings = await loadSettings();
    console.log('[BetterAliyunDoc] Restoring page settings on new document:', settings);

    // 1. 恢复主题
    if (settings.currentTheme && window.BetterAliyunDoc?.theme) {
      window.BetterAliyunDoc.theme.applyThemeStyles(settings.currentTheme);
    }

    // 2. 恢复纯享模式或侧边栏状态
    if (settings.isContentOnly) {
      // 如果上次设置是仅内容纯享模式
      if (window.BetterAliyunDoc?.content && !window.__betterAliyunDoc?.isContentOnly) {
        window.BetterAliyunDoc.content.toggleContent();
      }
    } else {
      // 如果不是纯享模式，恢复侧边栏折叠状态
      if (settings.leftCollapsed && window.BetterAliyunDoc?.layout) {
        window.BetterAliyunDoc.layout.toggleLeftSidebar();
      }
      if (settings.rightCollapsed && window.BetterAliyunDoc?.layout) {
        window.BetterAliyunDoc.layout.toggleRightSidebar();
      }

      // 3. 恢复正文宽度
      if (settings.contentWidth && window.__betterAliyunDoc) {
        window.__betterAliyunDoc.contentWidth = settings.contentWidth;
        const content = document.querySelector('.aliyun-docs-content');
        if (content) {
          content.style.width = `${settings.contentWidth}%`;
        }
      }
    }
  }

  // 挂载到命名空间
  window.BetterAliyunDoc = window.BetterAliyunDoc || {};
  window.BetterAliyunDoc.settings = {
    loadSettings: loadSettings,
    saveSetting: saveSetting,
    resetSettings: resetSettings,
    restorePageSettings: restorePageSettings
  };
})();
