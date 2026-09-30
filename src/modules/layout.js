// 初始化全局对象
if (!window.__betterAliyunDoc) {
  window.__betterAliyunDoc = {
    contentWidth: null, // 将由 init.js 初始化
    isWideContent: false,
    isLayoutAdjustmentInProgress: false // 标记是否由扩展程序主动触发的布局调整
  };
}

// 布局相关的常量
const LAYOUT_CONSTANTS = {
  MIN_WIDTH: 20,    // 最小宽度 20%
  MAX_WIDTH: 100,   // 最大宽度 100%
  STEP: 3,         // 每次调整 10%
  SIDEBAR_WIDTH: 240 // 侧边栏宽度
};

// 添加窗口大小变化事件监听，避免强制刷新页面
let resizeTimeout;
window.addEventListener('resize', () => {
  if (window.__betterAliyunDoc && window.__betterAliyunDoc.contentWidth !== null) {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      const content = document.querySelector('.aliyun-docs-content');
      if (content && !window.__betterAliyunDoc.isLayoutAdjustmentInProgress) {
        const contentWidth = (content.offsetWidth / window.innerWidth) * 100;
        window.__betterAliyunDoc.contentWidth = Math.round(contentWidth);
      }
    }, 200);
  }
});

// 处理正文区域宽度调整
function adjustSidebars(mode) {
  const content = document.querySelector('.aliyun-docs-content');
  const leftSidebar = document.querySelector('.aliyun-docs-menu') || document.querySelector('div[class*="Menu--helpMenuBox"]');
  const rightSidebar = document.querySelector('.aliyun-docs-side');

  if (!content) return;

  // 标记当前操作是由扩展程序触发
  window.__betterAliyunDoc.isLayoutAdjustmentInProgress = true;

  let newWidth;
  if (mode === 'wide') {
    newWidth = Math.min(window.__betterAliyunDoc.contentWidth + LAYOUT_CONSTANTS.STEP, LAYOUT_CONSTANTS.MAX_WIDTH);
    // 如果已经是最大宽度，直接返回避免不必要的宽度变化
    if (window.__betterAliyunDoc.contentWidth >= LAYOUT_CONSTANTS.MAX_WIDTH) {
      return;
    }
  } else if (mode === 'narrow') {
    newWidth = Math.max(window.__betterAliyunDoc.contentWidth - LAYOUT_CONSTANTS.STEP, LAYOUT_CONSTANTS.MIN_WIDTH);
  }

  console.log('[BetterAliyunDoc] Old content width:', window.__betterAliyunDoc.contentWidth + '%');
  console.log('[BetterAliyunDoc] New content width:', newWidth + '%');

  // 保存新的宽度状态
  window.__betterAliyunDoc.contentWidth = newWidth;
  window.__betterAliyunDoc.isWideContent = newWidth >= LAYOUT_CONSTANTS.MAX_WIDTH;
  window.BetterAliyunDoc.settings?.saveSetting('contentWidth', newWidth);

  // 保证元素宽度调整和过渡效果的顺序
  applyTransitionEffects([content, leftSidebar, rightSidebar]);
  adjustElementWidths(newWidth, { content, leftSidebar, rightSidebar });

  // 在宽度调整后再设置内容区域宽度
  window.requestAnimationFrame(() => {
    content.style.width = `${newWidth}%`;
    // Hide sidebars if content is at maximum width
    if (newWidth >= LAYOUT_CONSTANTS.MAX_WIDTH) {
      if (leftSidebar) leftSidebar.style.display = 'none';
      if (rightSidebar) rightSidebar.style.display = 'none';
    } else {
      if (leftSidebar) leftSidebar.style.display = '';
      if (rightSidebar) rightSidebar.style.display = '';
    }

    // 重置标记
    window.__betterAliyunDoc.isLayoutAdjustmentInProgress = false;
  });
}

// 应用过渡效果
function applyTransitionEffects(elements) {
  elements.filter(Boolean).forEach((el) => {
    el.style.transition = 'all 0.1s ease';
  });
}

// 调整元素宽度
function adjustElementWidths(width, elements) {
  const { content, leftSidebar, rightSidebar } = elements;
  const widthPx = (window.innerWidth * width) / 100;

  applySidebarStyles(leftSidebar, rightSidebar, width, widthPx);
  applyContentStyles(content, width);
}

// 应用侧边栏样式
function applySidebarStyles(leftSidebar, rightSidebar, width, widthPx) {
  const sidebarStyles = getSidebarStyles(width, widthPx);

  if (leftSidebar) {
    Object.entries(sidebarStyles.left).forEach(([prop, value]) => {
      leftSidebar.style.setProperty(prop, value, 'important');
    });
  }

  if (rightSidebar) {
    Object.entries(sidebarStyles.right).forEach(([prop, value]) => {
      rightSidebar.style.setProperty(prop, value, 'important');
    });
  }
}

// 获取侧边栏样式配置
function getSidebarStyles(width, widthPx) {
  const baseStyles = {
    position: 'relative',
    flex: `0 0 ${LAYOUT_CONSTANTS.SIDEBAR_WIDTH}px`
  };

  if (width >= 90) {
    return getCollapsedSidebarStyles(baseStyles);
  } else if (width >= 70) {
    return getPartiallyHiddenSidebarStyles(baseStyles, widthPx);
  }
  return getVisibleSidebarStyles(baseStyles);
}

// 获取完全收起的侧边栏样式
function getCollapsedSidebarStyles(baseStyles) {
  return {
    left: {
      ...baseStyles,
      'transform': 'translateX(-100%)',
      'opacity': '0',
      'pointer-events': 'none',
      'margin': '0'
    },
    right: {
      ...baseStyles,
      'transform': 'translateX(100%)',
      'opacity': '0',
      'pointer-events': 'none',
      'margin': '0'
    }
  };
}

// 获取部分隐藏的侧边栏样式
function getPartiallyHiddenSidebarStyles(baseStyles, widthPx) {
  const overlap = Math.max(0, (widthPx + 2 * LAYOUT_CONSTANTS.SIDEBAR_WIDTH - window.innerWidth) / 2);

  return {
    left: {
      ...baseStyles,
      'transform': overlap > 0 ? `translateX(-${overlap}px)` : 'none',
      'opacity': '1',
      'pointer-events': 'auto'
    },
    right: {
      ...baseStyles,
      'transform': overlap > 0 ? `translateX(${overlap}px)` : 'none',
      'opacity': '1',
      'pointer-events': 'auto'
    }
  };
}

// 获取完全可见的侧边栏样式
function getVisibleSidebarStyles(baseStyles) {
  return {
    left: {
      ...baseStyles,
      'margin-left': '0',
      'opacity': '1',
      'pointer-events': 'auto'
    },
    right: {
      ...baseStyles,
      'margin-right': '0',
      'opacity': '1',
      'pointer-events': 'auto'
    }
  };
}

// 应用内容区域样式
function applyContentStyles(content, width) {
  const contentStyles = {
    'position': 'relative',
    'flex': '1 1 auto',
    'width': 'auto',
    'min-width': '0',
    'max-width': `${width}%`,
    'margin': '0 auto',
    'transition': 'all 0.1s ease'
  };

  Object.entries(contentStyles).forEach(([prop, value]) => {
    content.style.setProperty(prop, value, 'important');
  });
}

// 侧边栏状态控制
const sidebarState = {
  leftCollapsed: false,
  rightCollapsed: false,
  leftBusy: false,
  rightBusy: false
};

// 收起或显示左侧边栏的函数
function toggleLeftSidebar() {
  const leftSidebar = document.querySelector('.aliyun-docs-menu') || document.querySelector('div[class*="Menu--helpMenuBox"]');
  const content = document.querySelector('.aliyun-docs-content');

  if (!leftSidebar || !content || sidebarState.leftBusy) return;
  sidebarState.leftBusy = true;
  window.setTimeout(() => { sidebarState.leftBusy = false; }, 250);

  leftSidebar.style.transition = 'all 0.2s ease';
  content.style.transition = 'all 0.2s ease';

  if (!sidebarState.leftCollapsed) {
    // 收起左侧边栏
    leftSidebar.style.opacity = '0';
    leftSidebar.style.transform = 'translateX(-100%)';
    window.setTimeout(() => {
      leftSidebar.style.display = 'none';
    }, 150);
    sidebarState.leftCollapsed = true;
    window.BetterAliyunDoc.settings?.saveSetting('leftCollapsed', true);
  } else {
    // 恢复左侧边栏
    leftSidebar.style.display = '';
    void leftSidebar.offsetHeight; // 强制回流以重置过渡
    leftSidebar.style.opacity = '1';
    leftSidebar.style.transform = 'translateX(0)';
    sidebarState.leftCollapsed = false;
    window.BetterAliyunDoc.settings?.saveSetting('leftCollapsed', false);
  }
}

// 收起或显示右侧边栏的函数
function toggleRightSidebar() {
  const rightSidebar = document.querySelector('.aliyun-docs-side');
  const content = document.querySelector('.aliyun-docs-content');
  const contentWrapper = document.querySelector('.aliyun-docs-content-wrapper') || content?.closest('[class*="contentWrapper"]') || content?.parentElement;

  if (!rightSidebar || !content || sidebarState.rightBusy) return;
  sidebarState.rightBusy = true;
  window.setTimeout(() => { sidebarState.rightBusy = false; }, 250);

  rightSidebar.style.transition = 'all 0.2s ease';
  content.style.transition = 'all 0.2s ease';
  if (contentWrapper) contentWrapper.style.transition = 'all 0.2s ease';

  if (!sidebarState.rightCollapsed) {
    // 收起右侧边栏
    rightSidebar.style.opacity = '0';
    rightSidebar.style.transform = 'translateX(100%)';
    window.setTimeout(() => {
      rightSidebar.style.display = 'none';
      rightSidebar.style.width = '0px';
      rightSidebar.style.flex = '0 0 0px';
    }, 150);

    // 核心：消除右侧占位与分割线，让正文占满右侧空间
    content.style.maxWidth = 'none';
    content.style.width = '100%';
    content.style.borderRight = 'none';
    if (contentWrapper) {
      contentWrapper.style.width = '100%';
    }
    sidebarState.rightCollapsed = true;
    window.BetterAliyunDoc.settings?.saveSetting('rightCollapsed', true);
  } else {
    // 恢复右侧边栏
    rightSidebar.style.display = '';
    rightSidebar.style.width = '';
    rightSidebar.style.flex = '';
    void rightSidebar.offsetHeight; // 强制回流
    rightSidebar.style.opacity = '1';
    rightSidebar.style.transform = 'translateX(0)';

    // 恢复正文样式
    content.style.maxWidth = '';
    content.style.width = '';
    content.style.borderRight = '';
    if (contentWrapper) {
      contentWrapper.style.width = '';
    }
    sidebarState.rightCollapsed = false;
    window.BetterAliyunDoc.settings?.saveSetting('rightCollapsed', false);
  }
}

// 屏幕顶部悬浮轻提示
function showToast(message) {
  const existing = document.getElementById('betterAliyunDoc-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'betterAliyunDoc-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.82);
    color: #fff;
    padding: 8px 18px;
    border-radius: 6px;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 1000000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    pointer-events: none;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(toast);
  window.setTimeout(() => {
    toast.style.opacity = '0';
    window.setTimeout(() => toast.remove(), 300);
  }, 1800);
}

// 重置页面布局到官方默认页面 (Alt + R)
function resetToOfficialLayout() {
  console.log('[BetterAliyunDoc] Resetting layout to official default...');

  // 1. 如果处于专注纯享模式，退出纯享模式
  if (window.__betterAliyunDoc?.isContentOnly) {
    if (window.BetterAliyunDoc?.content) {
      window.BetterAliyunDoc.content.toggleContent();
    }
  }

  // 2. 如果左侧边栏处于折叠状态，恢复左侧边栏
  if (sidebarState.leftCollapsed) {
    toggleLeftSidebar();
  }

  // 3. 如果右侧边栏处于折叠状态，恢复右侧边栏
  if (sidebarState.rightCollapsed) {
    toggleRightSidebar();
  }

  // 4. 重置正文宽度调整
  const content = document.querySelector('.aliyun-docs-content');
  const leftSidebar = document.querySelector('.aliyun-docs-menu') || document.querySelector('div[class*="Menu--helpMenuBox"]');
  const rightSidebar = document.querySelector('.aliyun-docs-side');
  const contentWrapper = document.querySelector('.aliyun-docs-content-wrapper') || content?.closest('[class*="contentWrapper"]') || content?.parentElement;

  if (content) {
    content.style.width = '';
    content.style.maxWidth = '';
    content.style.minWidth = '';
    content.style.flex = '';
    content.style.margin = '';
    content.style.borderRight = '';
  }
  if (contentWrapper) {
    contentWrapper.style.width = '';
  }
  if (leftSidebar) {
    leftSidebar.style.display = '';
    leftSidebar.style.transform = '';
    leftSidebar.style.opacity = '';
    leftSidebar.style.marginLeft = '';
  }
  if (rightSidebar) {
    rightSidebar.style.display = '';
    rightSidebar.style.transform = '';
    rightSidebar.style.opacity = '';
    rightSidebar.style.marginRight = '';
    rightSidebar.style.width = '';
    rightSidebar.style.flex = '';
  }

  // 5. 恢复主题为官方默认
  if (window.BetterAliyunDoc?.theme) {
    window.BetterAliyunDoc.theme.applyThemeStyles(null);
  }

  // 6. 重置并保存默认设置到存储中
  if (window.BetterAliyunDoc?.settings) {
    window.BetterAliyunDoc.settings.resetSettings();
  }

  // 7. 屏幕提示 Toast
  showToast('已重置页面布局为官方默认');
}

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.layout = {
  adjustSidebars: adjustSidebars,
  toggleLeftSidebar: toggleLeftSidebar,
  toggleRightSidebar: toggleRightSidebar,
  collapseLeftSidebar: toggleLeftSidebar,
  collapseRightSidebar: toggleRightSidebar,
  resetToOfficialLayout: resetToOfficialLayout,
  showToast: showToast
};
