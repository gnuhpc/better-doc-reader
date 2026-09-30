// 检查页面是否可以被提取
window.checkPage = function() {
  console.log('[BetterAliyunDoc] Checking page');
  const content = document.querySelector('.aliyun-docs-content');
  const isExtractable = content !== null;

  // 向 background script 报告页面状态
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    chrome.runtime.sendMessage({
      type: 'pageCheckResult',
      isExtractable: isExtractable
    });
  }

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

    // 为help icon和expandable-title-bold添加点击事件处理
    const helpIcons = clonedContent.querySelectorAll('.help-iconfont.help-icon-zhankai1.smallFont');
    const expandableTitles = clonedContent.querySelectorAll('.expandable-title-bold');

    const addExpandHandler = (element) => {
      element.addEventListener('click', (e) => {
        const section = e.target.closest('section');
        if (section) {
          section.classList.toggle('expanded');
        }
      });
    };

    helpIcons.forEach(addExpandHandler);
    expandableTitles.forEach(addExpandHandler);

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
    window.BetterAliyunDoc.settings?.saveSetting('isContentOnly', true);

    // 启用侧边抽屉悬浮交互（鼠标靠近左右两侧浮现目录/大纲）
    setupHoverDrawers();
  } else {
    // 清理侧边悬浮抽屉
    cleanupHoverDrawers();

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
    window.BetterAliyunDoc.settings?.saveSetting('isContentOnly', false);
  }

  // 向 background script 报告状态变化
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    chrome.runtime.sendMessage({
      type: 'contentState',
      isContentOnly: window.__betterAliyunDoc.isContentOnly,
      isExtractable: true
    });
  }
}

let liveLeftMenu = null;
let leftMenuPlaceholder = null;
let leftMenuRetryTimer = null;

// 清理悬浮抽屉
function cleanupHoverDrawers() {
  if (leftMenuRetryTimer) {
    window.clearInterval(leftMenuRetryTimer);
    leftMenuRetryTimer = null;
  }
  if (window.__betterAliyunDocDrawerCleanup) {
    window.__betterAliyunDocDrawerCleanup();
    window.__betterAliyunDocDrawerCleanup = null;
  }

  // 恢复之前移动到抽屉中的实时目录节点回原DOM位置
  if (liveLeftMenu) {
    if (leftMenuPlaceholder && leftMenuPlaceholder.parentNode) {
      leftMenuPlaceholder.parentNode.insertBefore(liveLeftMenu, leftMenuPlaceholder);
      leftMenuPlaceholder.remove();
    }
    if (liveLeftMenu._badOriginalStyle) {
      liveLeftMenu.style.display = liveLeftMenu._badOriginalStyle.display;
      liveLeftMenu.style.visibility = liveLeftMenu._badOriginalStyle.visibility;
      liveLeftMenu.style.opacity = liveLeftMenu._badOriginalStyle.opacity;
      liveLeftMenu.style.transform = liveLeftMenu._badOriginalStyle.transform;
      liveLeftMenu.style.width = liveLeftMenu._badOriginalStyle.width;
      liveLeftMenu.style.height = liveLeftMenu._badOriginalStyle.height;
      liveLeftMenu.style.position = liveLeftMenu._badOriginalStyle.position;
      liveLeftMenu.style.maxHeight = liveLeftMenu._badOriginalStyle.maxHeight;
      liveLeftMenu.style.overflow = liveLeftMenu._badOriginalStyle.overflow;
      delete liveLeftMenu._badOriginalStyle;
    } else {
      liveLeftMenu.style.display = '';
      liveLeftMenu.style.visibility = '';
      liveLeftMenu.style.opacity = '';
      liveLeftMenu.style.transform = '';
      liveLeftMenu.style.width = '';
      liveLeftMenu.style.height = '';
      liveLeftMenu.style.position = '';
      liveLeftMenu.style.maxHeight = '';
      liveLeftMenu.style.overflow = '';
    }
  }
  liveLeftMenu = null;
  leftMenuPlaceholder = null;

  const elIds = [
    'betterAliyunDoc-drawer-styles',
    'betterAliyunDoc-left-trigger',
    'betterAliyunDoc-left-drawer',
    'betterAliyunDoc-right-trigger',
    'betterAliyunDoc-right-drawer'
  ];
  elIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

// 获取原始左侧目录节点
function getOriginalLeftMenu() {
  return (
    document.querySelector('.aliyun-docs-menu') ||
    document.querySelector('#aliyun-docs-menu') ||
    document.querySelector('div[class*="Menu--helpMenuBox"]') ||
    document.querySelector('#help-menu-box') ||
    document.querySelector('div[class*="helpMenuBox"]') ||
    document.querySelector('[class*="helpMenu--"]') ||
    document.querySelector('#common-menu-container')?.closest('[class*="helpMenuBox"], nav, div')
  );
}

// 获取原始右侧边栏节点
function getOriginalRightMenu() {
  return (
    document.querySelector('.aliyun-docs-side') ||
    document.querySelector('#aliyun-docs-side-content') ||
    document.querySelector('div[class*="sideContent"]')
  );
}

// 将左侧目录真实节点挂载到抽屉中
function mountLeftMenu(leftBody) {
  if (!leftBody) return false;
  if (liveLeftMenu && leftBody.contains(liveLeftMenu)) {
    return true;
  }

  const originalLeft = getOriginalLeftMenu();
  if (originalLeft && originalLeft.parentNode && originalLeft !== leftBody && !leftBody.contains(originalLeft)) {
    liveLeftMenu = originalLeft;
    leftMenuPlaceholder = document.createComment('betterAliyunDoc-left-placeholder');
    originalLeft.parentNode.insertBefore(leftMenuPlaceholder, originalLeft);

    liveLeftMenu._badOriginalStyle = {
      display: originalLeft.style.display,
      visibility: originalLeft.style.visibility,
      opacity: originalLeft.style.opacity,
      transform: originalLeft.style.transform,
      width: originalLeft.style.width,
      height: originalLeft.style.height,
      position: originalLeft.style.position,
      maxHeight: originalLeft.style.maxHeight,
      overflow: originalLeft.style.overflow
    };

    originalLeft.style.display = 'block';
    originalLeft.style.visibility = 'visible';
    originalLeft.style.opacity = '1';
    originalLeft.style.transform = 'none';
    originalLeft.style.width = '100%';
    originalLeft.style.height = 'auto';
    originalLeft.style.position = 'static';

    leftBody.innerHTML = '';
    leftBody.appendChild(originalLeft);
    return true;
  }
  return false;
}

// 填充右侧大纲抽屉（本页导读 / 跳转）
function populateRightOutline(rightBody, originalRight) {
  rightBody.innerHTML = '';
  const contentContainer = document.getElementById('betterAliyunDoc-content-only');
  const headings = contentContainer ? Array.from(contentContainer.querySelectorAll('h1, h2, h3, h4')) : [];

  if (headings.length > 0) {
    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '2px';

    headings.forEach((heading, idx) => {
      const text = heading.textContent.trim();
      if (!text) return;

      if (!heading.id) {
        heading.id = `bad-heading-${idx}`;
      }

      const item = document.createElement('div');
      const tag = heading.tagName.toLowerCase();
      const level = tag === 'h1' ? '1' : tag === 'h2' ? '2' : '3';
      item.className = `bad-outline-item level-${level}`;
      item.innerHTML = `<span class="bad-outline-dot"></span><span>${text}</span>`;

      item.addEventListener('click', () => {
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const origTransition = heading.style.transition;
        const origBg = heading.style.backgroundColor;
        heading.style.transition = 'background-color 0.3s ease';
        heading.style.backgroundColor = 'rgba(24, 144, 255, 0.15)';
        window.setTimeout(() => {
          heading.style.backgroundColor = origBg;
          window.setTimeout(() => {
            heading.style.transition = origTransition;
          }, 300);
        }, 1000);
      });

      list.appendChild(item);
    });

    rightBody.appendChild(list);
  } else if (originalRight) {
    const clonedRight = originalRight.cloneNode(true);
    clonedRight.style.display = 'block';
    clonedRight.style.width = '100%';
    clonedRight.style.height = 'auto';
    clonedRight.style.position = 'static';
    rightBody.appendChild(clonedRight);
  } else {
    rightBody.innerHTML = '<p style="color:#999;font-size:13px;text-align:center;padding:24px 0;">当前页面暂无大纲</p>';
  }
}

// 绑定抽屉交互逻辑
function setupDrawerInteractions(leftTrigger, leftDrawer, rightTrigger, rightDrawer) {
  let leftTimer = null;
  let rightTimer = null;
  const DELAY = 300;

  const closeRight = (delay = DELAY) => {
    window.clearTimeout(rightTimer);
    if (delay === 0) {
      rightDrawer.classList.remove('bad-drawer-open');
    } else {
      rightTimer = window.setTimeout(() => {
        rightDrawer.classList.remove('bad-drawer-open');
      }, delay);
    }
  };

  const closeLeft = (delay = DELAY) => {
    window.clearTimeout(leftTimer);
    if (delay === 0) {
      leftDrawer.classList.remove('bad-drawer-open');
    } else {
      leftTimer = window.setTimeout(() => {
        leftDrawer.classList.remove('bad-drawer-open');
      }, delay);
    }
  };

  const openLeft = () => {
    window.clearTimeout(leftTimer);
    window.clearTimeout(rightTimer);
    closeRight(0);
    // 异步加载容错：若之前未能成功获取目录，在用户打开抽屉时立即尝试挂载
    if (!liveLeftMenu) {
      const leftBody = leftDrawer.querySelector('#betterAliyunDoc-left-drawer-body');
      if (leftBody) {
        mountLeftMenu(leftBody);
      }
    }
    leftDrawer.classList.add('bad-drawer-open');
  };

  const openRight = () => {
    window.clearTimeout(leftTimer);
    window.clearTimeout(rightTimer);
    closeLeft(0);
    // 异步加载容错：若大纲尚未生成，在用户打开抽屉时重新提取
    const rightBody = rightDrawer.querySelector('#betterAliyunDoc-right-drawer-body');
    if (rightBody && (rightBody.children.length === 0 || rightBody.textContent.includes('当前页面暂无大纲'))) {
      populateRightOutline(rightBody, getOriginalRightMenu());
    }
    rightDrawer.classList.add('bad-drawer-open');
  };

  leftTrigger.addEventListener('mouseenter', openLeft);
  leftTrigger.addEventListener('mouseleave', () => closeLeft(DELAY));
  leftDrawer.addEventListener('mouseenter', openLeft);
  leftDrawer.addEventListener('mouseleave', () => closeLeft(DELAY));

  rightTrigger.addEventListener('mouseenter', openRight);
  rightTrigger.addEventListener('mouseleave', () => closeRight(DELAY));
  rightDrawer.addEventListener('mouseenter', openRight);
  rightDrawer.addEventListener('mouseleave', () => closeRight(DELAY));

  const leftClose = leftDrawer.querySelector('.bad-drawer-close');
  if (leftClose) {
    leftClose.addEventListener('click', () => closeLeft(0));
  }
  const rightClose = rightDrawer.querySelector('.bad-drawer-close');
  if (rightClose) {
    rightClose.addEventListener('click', () => closeRight(0));
  }

  leftDrawer.addEventListener(
    'click',
    (e) => {
      const link = e.target.closest('a') || e.target.querySelector(':scope > a');
      if (link && link.href) {
        closeLeft(150);

        // 如果用户按住修饰键（Cmd/Ctrl/Shift）或带有 target="_blank"，在新标签页打开
        if (e.metaKey || e.ctrlKey || e.shiftKey || link.target === '_blank') {
          window.open(link.href, '_blank');
          return;
        }

        try {
          const targetUrl = new window.URL(link.href, window.location.href);
          const currentUrl = new window.URL(window.location.href);

          // 如果是跨页文档链接（路径或查询参数不同）
          if (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) {
            window.location.href = link.href;
          } else if (targetUrl.hash) {
            const targetEl = document.querySelector(targetUrl.hash);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        } catch (err) {
          window.location.href = link.href;
        }
      }
    },
    true
  );

  rightDrawer.addEventListener('click', (e) => {
    const item = e.target.closest('.bad-outline-item');
    if (item) {
      closeRight(150);
    }
  });

  const handleMouseMove = (e) => {
    if (e.clientX <= 16) {
      openLeft();
    } else if (e.clientX >= window.innerWidth - 16) {
      openRight();
    }
  };
  window.addEventListener('mousemove', handleMouseMove);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLeft(0);
      closeRight(0);
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  window.__betterAliyunDocDrawerCleanup = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('keydown', handleKeyDown);
    window.clearTimeout(leftTimer);
    window.clearTimeout(rightTimer);
  };
}

// 初始化悬浮抽屉
function setupHoverDrawers() {
  cleanupHoverDrawers();

  const originalRight = getOriginalRightMenu();

  const style = document.createElement('style');
  style.id = 'betterAliyunDoc-drawer-styles';
  style.textContent = `
    .bad-drawer-trigger {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 22px;
      z-index: 99998;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      transition: background-color 0.2s ease;
    }
    .bad-drawer-trigger:hover {
      background-color: rgba(24, 144, 255, 0.08);
    }
    .bad-drawer-trigger-left {
      left: 0;
    }
    .bad-drawer-trigger-right {
      right: 0;
    }
    .bad-drawer-handle {
      writing-mode: vertical-lr;
      padding: 12px 5px;
      font-size: 12px;
      font-weight: 500;
      color: #666;
      background: #fff;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      opacity: 0.45;
      transition: all 0.2s;
      user-select: none;
    }
    .bad-drawer-trigger-left .bad-drawer-handle {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .bad-drawer-trigger-right .bad-drawer-handle {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .bad-drawer-trigger:hover .bad-drawer-handle {
      opacity: 1;
      transform: scale(1.06);
      color: #1890ff;
      border-color: #1890ff;
    }

    .bad-drawer {
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: 99999;
      background: #ffffff;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      max-width: 85vw;
    }
    .bad-drawer-left {
      left: 0;
      width: 330px;
      transform: translateX(-100%);
      border-right: 1px solid #e8e8e8;
    }
    .bad-drawer-right {
      right: 0;
      width: 300px;
      transform: translateX(100%);
      border-left: 1px solid #e8e8e8;
    }
    .bad-drawer.bad-drawer-open {
      transform: translateX(0) !important;
    }

    .bad-drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 16px;
      border-bottom: 1px solid #f0f0f0;
      background: #fafafa;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      flex-shrink: 0;
    }
    .bad-drawer-close {
      cursor: pointer;
      border: none;
      background: transparent;
      font-size: 16px;
      color: #999;
      padding: 3px 8px;
      border-radius: 4px;
      transition: all 0.15s;
    }
    .bad-drawer-close:hover {
      background: #eee;
      color: #333;
    }
    .bad-drawer-body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px;
    }
    .bad-drawer-left [class*="helpMenuBox"],
    .bad-drawer-left [class*="helpMenuInnerBox"],
    .bad-drawer-left [class*="help-menu-scroll-container"] {
      width: 100% !important;
      max-width: 100% !important;
      position: static !important;
      height: auto !important;
      background: transparent !important;
    }
    .bad-drawer-left a {
      text-decoration: none !important;
    }
    .bad-drawer-left li {
      list-style: none !important;
    }

    .bad-outline-item {
      padding: 7px 10px;
      margin: 3px 0;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      line-height: 1.4;
      color: #444;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
    }
    .bad-outline-item:hover {
      background-color: #f0f7ff;
      color: #1890ff;
    }
    .bad-outline-item.level-1 {
      font-weight: 600;
      padding-left: 8px;
    }
    .bad-outline-item.level-2 {
      padding-left: 20px;
    }
    .bad-outline-item.level-3 {
      padding-left: 32px;
      color: #666;
    }
    .bad-outline-dot {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #bfbfbf;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .bad-outline-item:hover .bad-outline-dot {
      background: #1890ff;
    }
  `;
  document.head.appendChild(style);

  const leftTrigger = document.createElement('div');
  leftTrigger.className = 'bad-drawer-trigger bad-drawer-trigger-left';
  leftTrigger.id = 'betterAliyunDoc-left-trigger';
  leftTrigger.innerHTML = '<span class="bad-drawer-handle">📖 目录</span>';

  const leftDrawer = document.createElement('div');
  leftDrawer.className = 'bad-drawer bad-drawer-left';
  leftDrawer.id = 'betterAliyunDoc-left-drawer';
  leftDrawer.innerHTML = `
    <div class="bad-drawer-header">
      <span>📖 产品文档目录</span>
      <button class="bad-drawer-close" title="收起">✕</button>
    </div>
    <div class="bad-drawer-body" id="betterAliyunDoc-left-drawer-body"></div>
  `;

  const rightTrigger = document.createElement('div');
  rightTrigger.className = 'bad-drawer-trigger bad-drawer-trigger-right';
  rightTrigger.id = 'betterAliyunDoc-right-trigger';
  rightTrigger.innerHTML = '<span class="bad-drawer-handle">📑 本页导读</span>';

  const rightDrawer = document.createElement('div');
  rightDrawer.className = 'bad-drawer bad-drawer-right';
  rightDrawer.id = 'betterAliyunDoc-right-drawer';
  rightDrawer.innerHTML = `
    <div class="bad-drawer-header">
      <span>📑 本页大纲导读</span>
      <button class="bad-drawer-close" title="收起">✕</button>
    </div>
    <div class="bad-drawer-body" id="betterAliyunDoc-right-drawer-body"></div>
  `;

  document.body.appendChild(leftTrigger);
  document.body.appendChild(leftDrawer);
  document.body.appendChild(rightTrigger);
  document.body.appendChild(rightDrawer);

  const leftBody = leftDrawer.querySelector('#betterAliyunDoc-left-drawer-body');
  if (!mountLeftMenu(leftBody)) {
    leftBody.innerHTML = '<p style="color:#999;font-size:13px;text-align:center;padding:24px 0;">目录加载中...</p>';
    let retries = 0;
    if (leftMenuRetryTimer) {
      window.clearInterval(leftMenuRetryTimer);
    }
    leftMenuRetryTimer = window.setInterval(() => {
      retries++;
      if (mountLeftMenu(leftBody) || retries >= 30) {
        window.clearInterval(leftMenuRetryTimer);
        leftMenuRetryTimer = null;
        if (!liveLeftMenu && retries >= 30) {
          leftBody.innerHTML = '<p style="color:#999;font-size:13px;text-align:center;padding:24px 0;">未找到左侧目录</p>';
        }
      }
    }, 100);
  }

  const rightBody = rightDrawer.querySelector('#betterAliyunDoc-right-drawer-body');
  populateRightOutline(rightBody, originalRight);

  setupDrawerInteractions(leftTrigger, leftDrawer, rightTrigger, rightDrawer);
}

// 监听来自 background script 的消息
if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 只响应来自快捷键和background script的toggleContent消息
    if (message.action === 'toggleContent' && (sender.id === chrome.runtime.id || message.source === 'keyboard')) {
      toggleContent();
      sendResponse({ success: true });
    }
  });
}

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.content = {
  checkPage: window.checkPage,
  toggleContent: toggleContent
};

