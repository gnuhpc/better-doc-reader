// 初始化全局对象
if (!window.__betterAliyunDoc) {
  window.__betterAliyunDoc = {
    contentWidth: null, // 将由 init.js 初始化
    isWideContent: false
  };
}

// 布局相关的常量
const LAYOUT_CONSTANTS = {
  MIN_WIDTH: 20,    // 最小宽度 20%
  MAX_WIDTH: 100,   // 最大宽度 100%
  STEP: 3,         // 每次调整 10%
  SIDEBAR_WIDTH: 240 // 侧边栏宽度
};

// 处理正文区域宽度调整
function adjustSidebars(mode) {
  const content = document.querySelector('.aliyun-docs-content');
  const leftSidebar = document.querySelector('.aliyun-docs-menu');
  const rightSidebar = document.querySelector('.aliyun-docs-side');

  if (!content || !leftSidebar || !rightSidebar) return;

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

  // 保证元素宽度调整和过渡效果的顺序
  applyTransitionEffects([content, leftSidebar, rightSidebar]);
  adjustElementWidths(newWidth, { content, leftSidebar, rightSidebar });

  // 在宽度调整后再设置内容区域宽度
  window.requestAnimationFrame(() => {
    content.style.width = `${newWidth}%`;
  });

  // Hide sidebars if content is at maximum width
  if (newWidth >= LAYOUT_CONSTANTS.MAX_WIDTH) {
    leftSidebar.style.display = 'none';
    rightSidebar.style.display = 'none';
  } else {
    leftSidebar.style.display = '';
    rightSidebar.style.display = '';
  }
}

// 应用容器样式
function applyContainerStyles(container) {
  const styles = {
    'display': 'flex',
    'justify-content': 'space-between',
    'align-items': 'flex-start',
    'width': '100%',
    'position': 'relative',
    'overflow': 'visible',
    'gap': '0',
    'padding': '0'
  };

  Object.entries(styles).forEach(([prop, value]) => {
    container.style.setProperty(prop, value, 'important');
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

// 收起或显示左侧边栏的函数
function toggleLeftSidebar() {
  const leftSidebar = document.querySelector('.Menu--helpMenuBox--rvBkNtL');
  const content = document.querySelector('.aliyun-docs-content');

  if (!leftSidebar || !content) return;

  // 如果style.display未设置，先获取计算后的display值
  const currentDisplay = leftSidebar.style.display || window.getComputedStyle(leftSidebar).display;
  const isHidden = currentDisplay === 'none';

  leftSidebar.style.transition = 'all 0.1s ease';
  content.style.transition = 'all 0.1s ease';

  if (isHidden) {
    // 显示左侧边栏
    leftSidebar.style.display = 'block';
    leftSidebar.style.opacity = '1';
    leftSidebar.style.transform = 'translateX(0)';
    leftSidebar.style.zIndex = '1';
    content.style.marginLeft = '0';
    content.style.width = 'calc(100% - 240px)';
    content.style.zIndex = '2';
  } else {
    // 收起左侧边栏
    leftSidebar.style.opacity = '0';
    leftSidebar.style.transform = 'translateX(-100%)';
    window.setTimeout(() => {
      leftSidebar.style.display = 'none';
    }, 100); // 等待过渡效果完成后隐藏
    content.style.marginLeft = '0';
    content.style.width = '100%';
  }
}

// 收起或显示右侧边栏的函数
function toggleRightSidebar() {
  const rightSidebar = document.querySelector('.aliyun-docs-side');
  const content = document.querySelector('.aliyun-docs-content');
  const contentWrapper = document.querySelector('.aliyun-docs-content-wrapper');

  if (!rightSidebar || !content) return;

  // 如果style.display未设置，先获取计算后的display值
  const currentDisplay = rightSidebar.style.display || window.getComputedStyle(rightSidebar).display;
  const isHidden = currentDisplay === 'none';

  rightSidebar.style.transition = 'all 0.1s ease';
  content.style.transition = 'all 0.1s ease';
  if (contentWrapper) contentWrapper.style.transition = 'all 0.1s ease';

  if (isHidden) {
    // 显示右侧边栏
    rightSidebar.style.display = 'block';
    rightSidebar.style.opacity = '1';
    rightSidebar.style.transform = 'translateX(0)';
    rightSidebar.style.zIndex = '1';
    content.style.marginRight = '0';
    content.style.width = 'calc(100% - 240px)';
    content.style.zIndex = '2';
    if (contentWrapper) {
      contentWrapper.style.width = '';
      contentWrapper.style.zIndex = '2';
    }
  } else {
    // 收起右侧边栏
    rightSidebar.style.opacity = '0';
    rightSidebar.style.transform = 'translateX(100%)';
    window.setTimeout(() => {
      rightSidebar.style.display = 'none';
    }, 100); // 等待过渡效果完成后隐藏
    content.style.marginRight = '0';
    content.style.width = '100%';
    if (contentWrapper) {
      contentWrapper.style.width = '100%';
    }
  }
}

// 调整布局
function adjustLayout() {
  console.log('[BetterAliyunDoc] Adjusting layout');
  const contentElement = document.querySelector('.aliyun-docs-content');
  if (!contentElement) return;

  // 根据当前状态调整布局
  if (window.__betterAliyunDoc.isWideContent) {
    adjustSidebars('wide');
  } else {
    adjustSidebars('narrow');
  }
}

// 状态变量
const sidebarState = {
  leftSidebarCollapsed: false,
  rightSidebarCollapsed: false
};

// 收起或恢复左侧边栏的函数
function collapseLeftSidebar() {
  const leftSidebar = document.querySelector('.Menu--helpMenuBox--rvBkNtL');
  const content = document.querySelector('.aliyun-docs-content');
  if (!leftSidebar || !content) return;

  leftSidebar.style.transition = 'all 0.1s ease';
  content.style.transition = 'all 0.1s ease';

  if (!sidebarState.leftSidebarCollapsed) {
    // 收起左侧边栏
    leftSidebar.style.opacity = '0';
    leftSidebar.style.transform = 'translateX(-100%)';
    window.setTimeout(() => {
      leftSidebar.style.display = 'none';
    }, 100);
    content.style.marginLeft = '0';
    content.style.width = '100%';
    sidebarState.leftSidebarCollapsed = true;
  } else {
    // 恢复左侧边栏
    leftSidebar.style.display = 'block';
    leftSidebar.style.opacity = '1';
    leftSidebar.style.transform = 'translateX(0)';
    leftSidebar.style.zIndex = '1';
    content.style.marginLeft = '0';
    content.style.width = 'calc(100% - 240px)';
    content.style.zIndex = '2';
    sidebarState.leftSidebarCollapsed = false;
  }
}

// 收起或恢复右侧边栏的函数
function collapseRightSidebar() {
  const rightSidebar = document.querySelector('.aliyun-docs-side');
  const content = document.querySelector('.aliyun-docs-content');
  const contentWrapper = document.querySelector('.aliyun-docs-content-wrapper');
  if (!rightSidebar || !content) return;

  rightSidebar.style.transition = 'all 0.1s ease';
  content.style.transition = 'all 0.1s ease';
  if (contentWrapper) contentWrapper.style.transition = 'all 0.1s ease';

  if (!sidebarState.rightSidebarCollapsed) {
    // 收起右侧边栏
    rightSidebar.style.opacity = '0';
    rightSidebar.style.transform = 'translateX(100%)';
    window.setTimeout(() => {
      rightSidebar.style.display = 'none';
    }, 100);
    const mainContentWidth = document.querySelector('.aliyun-docs-content-layout-main')?.offsetWidth || window.innerWidth;
    content.style.marginRight = '0';
    content.style.width = `${mainContentWidth}px`;
    content.style.maxWidth = 'none';
    if (contentWrapper) {
      contentWrapper.style.width = `${mainContentWidth}px`;
      contentWrapper.style.maxWidth = 'none';
    }
    sidebarState.rightSidebarCollapsed = true;
  } else {
    // 恢复右侧边栏
    rightSidebar.style.display = 'block';
    rightSidebar.style.opacity = '1';
    rightSidebar.style.transform = 'translateX(0)';
    rightSidebar.style.zIndex = '1';
    content.style.marginRight = '0';
    content.style.width = '';
    content.style.maxWidth = '';
    content.style.zIndex = '2';
    if (contentWrapper) {
      contentWrapper.style.width = '';
      contentWrapper.style.maxWidth = '';
      contentWrapper.style.zIndex = '2';
    }
    sidebarState.rightSidebarCollapsed = false;
  }
}

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.layout = {
  adjustLayout: adjustLayout,
  adjustSidebars: adjustSidebars,
  toggleLeftSidebar: toggleLeftSidebar,
  toggleRightSidebar: toggleRightSidebar,
  collapseLeftSidebar: collapseLeftSidebar,
  collapseRightSidebar: collapseRightSidebar
};
