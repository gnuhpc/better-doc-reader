// 检查页面是否可以被提取
window.checkPage = function() {
  console.log('[BetterAliyunDoc] Checking page');
  const content = document.querySelector('.aliyun-docs-content');
  const isExtractable = content !== null;

  // 向 background script 报告页面状态
  chrome.runtime.sendMessage({
    type: 'pageCheckResult',
    isExtractable: isExtractable
  });

  return isExtractable;
};

// 切换内容显示模式
function toggleContent() {
  // 确保全局状态已初始化
  if (!window.__betterAliyunDoc) {
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.init) {
      window.BetterAliyunDoc.init.initializeGlobalState();
    } else {
      console.error('[BetterAliyunDoc] Unable to initialize global state');
      return;
    }
  }

  const content = document.querySelector('.aliyun-docs-content');
  if (!content) {
    console.log('No content found to extract');
    return;
  }

  if (!window.__betterAliyunDoc.isContentOnly) {
    // 隐藏所有现有内容但保留它们
    Array.from(document.body.children).forEach((child) => {
      child.style.display = 'none';
    });

    // 保存原始body样式
    window.__betterAliyunDoc.originalStyles = document.body.getAttribute('style');

    // 创建新的内容容器
    const container = document.createElement('div');
    container.style.cssText = `
            width: 96vw;
            margin: 0 auto;
            padding: 20px 2vw;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        `;

    // 克隆内容并应用新样式
    const clonedContent = content.cloneNode(true);
    clonedContent.style.cssText = `
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
        `;

    // 为help icon添加点击事件处理
    const helpIcons = clonedContent.querySelectorAll('.help-iconfont.help-icon-zhankai1.smallFont');
    helpIcons.forEach((icon) => {
      icon.addEventListener('click', (e) => {
        const section = e.target.closest('section');
        if (section) {
          section.classList.toggle('expanded');
        }
      });
    });

    // 为tabbed-content-box添加点击事件处理
    const tabbedContentBoxes = clonedContent.querySelectorAll('.tabbed-content-box');
    tabbedContentBoxes.forEach((box) => {
      const tabItems = box.querySelectorAll('.tab-item');
      const sections = Array.from(box.children).filter((el) =>
        el.tagName === 'SECTION' && !el.classList.contains('tab-box'));
      tabItems.forEach((tab) => {
        tab.addEventListener('click', () => {
          // 移除所有tab的selected-tab-item类
          tabItems.forEach((t) => t.classList.remove('selected-tab-item'));
          // 给当前点击的tab添加selected-tab-item类
          tab.classList.add('selected-tab-item');
          // 隐藏所有section
          sections.forEach((section) => {
            section.style.display = 'none';
          });
          // 显示被点击的tab对应的section
          const clickedIndex = Array.from(tabItems).indexOf(tab);
          if (sections[clickedIndex]) {
            sections[clickedIndex].style.display = 'block';
          }
        });
      });
    });

    // 确保内容中的所有表格和图片都能适应宽度
    const tables = clonedContent.getElementsByTagName('table');
    for (let table of tables) {
      table.style.width = '100%';
      table.style.maxWidth = 'none';
    }

    const images = clonedContent.getElementsByTagName('img');
    for (let img of images) {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    }

    // 添加内容到容器
    container.appendChild(clonedContent);

    // 设置页面样式并添加新容器
    document.body.style.cssText = 'background-color: #fff; margin: 0; padding: 0; width: 100vw; max-width: 100vw; overflow-x: hidden;';
    container.id = 'betterAliyunDoc-content-only';
    document.body.appendChild(container);

    window.__betterAliyunDoc.isContentOnly = true;
  } else {
    // 移除content-only容器并显示原始内容
    const contentOnlyContainer = document.getElementById('betterAliyunDoc-content-only');
    if (contentOnlyContainer) {
      contentOnlyContainer.remove();
    }

    // 恢复所有原始内容的显示
    Array.from(document.body.children).forEach((child) => {
      child.style.display = '';
    });

    // 恢复原始样式
    if (window.__betterAliyunDoc.originalStyles) {
      document.body.setAttribute('style', window.__betterAliyunDoc.originalStyles);
    } else {
      document.body.removeAttribute('style');
    }

    window.__betterAliyunDoc.isContentOnly = false;
  }

  // 向 background script 报告状态变化
  chrome.runtime.sendMessage({
    type: 'contentState',
    isContentOnly: window.__betterAliyunDoc.isContentOnly,
    isExtractable: true
  });
}

// 监听来自 background script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 只响应来自快捷键和background script的toggleContent消息
  if (message.action === 'toggleContent' && (sender.id === chrome.runtime.id || message.source === 'keyboard')) {
    toggleContent();
    sendResponse({ success: true });
  }
});

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.content = {
  checkPage: window.checkPage,
  toggleContent: toggleContent
};
