// 跟踪注入状态
const injectedTabs = new Set();
const extractablePages = new Set();

// 监听键盘命令
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (tab?.id) {
    if (['narrow-content', 'widen-content', 'collapse-left-sidebar', 'collapse-right-sidebar'].includes(command)) {
      console.log('[BetterAliyunDoc] Sending command:', command);
      if (command === 'collapse-left-sidebar') {
        chrome.tabs.sendMessage(tab.id, { command: 'collapse-left-sidebar', action: 'collapseLeftSidebar' });
      } else if (command === 'collapse-right-sidebar') {
        chrome.tabs.sendMessage(tab.id, { command: 'collapse-right-sidebar', action: 'collapseRightSidebar' });
      } else {
        chrome.tabs.sendMessage(tab.id, { command });
      }
    } else if (command === 'toggle-view') {
      chrome.tabs.sendMessage(tab.id, {
        command: 'toggle-view',
        source: 'keyboard'
      });
    } else if (command === 'toggle-dark-mode') {
      const { theme } = await chrome.storage.local.get('theme');
      // 循环切换主题：无主题 -> dark -> green -> parchment -> 无主题
      let nextTheme;
      if (!theme) {
        nextTheme = 'dark';
      } else if (theme === 'dark') {
        nextTheme = 'green';
      } else if (theme === 'green') {
        nextTheme = 'parchment';
      } else {
        nextTheme = null;  // 返回到无主题状态
      }

      if (nextTheme) {
        await chrome.storage.local.set({ theme: nextTheme });
      } else {
        await chrome.storage.local.remove('theme');
      }
      chrome.tabs.sendMessage(tab.id, {
        action: 'changeTheme',
        theme: nextTheme
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'pageCheckResult') {
    if (message.isExtractable) {
      extractablePages.add(sender.tab.id);
      // 设置红点图标
      chrome.action.setIcon({
        path: {
          '16': 'icons/icon-16-dot.png',
          '48': 'icons/icon-48-dot.png',
          '128': 'icons/icon-128-dot.png'
        },
        tabId: sender.tab.id
      });
    } else {
      extractablePages.delete(sender.tab.id);
      // 设置普通图标
      chrome.action.setIcon({
        path: {
          '16': 'icons/icon-16.png',
          '48': 'icons/icon-48.png',
          '128': 'icons/icon-128.png'
        },
        tabId: sender.tab.id
      });
    }
  } else if (message.type === 'contentState') {
    // 根据内容状态更新图标
    const iconType = message.isContentOnly ? '-active' : message.isExtractable ? '-dot' : '';
    chrome.action.setIcon({
      path: {
        '16': `icons/icon-16${iconType}.png`,
        '48': `icons/icon-48${iconType}.png`,
        '128': `icons/icon-128${iconType}.png`
      },
      tabId: sender.tab.id
    });
  }
});

// 不再需要图标点击处理器，因为现在使用popup

// 当标签页更新时，重新检查页面
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // 移除注入状态
    injectedTabs.delete(tabId);
    extractablePages.delete(tabId);
  }
});

// 当标签页关闭时，清理状态
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
  extractablePages.delete(tabId);
});
