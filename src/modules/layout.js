// 布局相关的常量
const LAYOUT_CONSTANTS = {
    MIN_WIDTH: 20,    // 最小宽度 20%
    MAX_WIDTH: 100,   // 最大宽度 100%
    STEP: 10,         // 每次调整 10%
    SIDEBAR_WIDTH: 240 // 侧边栏宽度
};

// 处理正文区域宽度调整
function adjustSidebars(mode) {
    console.log('[BetterAliyunDoc] Adjusting content width, mode:', mode);
    
    // 获取所有相关元素
    const content = document.querySelector('.aliyun-docs-content');
    const leftSidebar = document.querySelector('.Menu--helpMenuBox--rvBkNtL');
    const rightSidebar = document.querySelector('.aliyun-docs-side');
    const container = content.parentElement;
    
    console.log('[BetterAliyunDoc] Found elements:', {
        content: !!content,
        leftSidebar: !!leftSidebar,
        rightSidebar: !!rightSidebar,
        container: !!container
    });

    if (!content || !container) {
        console.log('[BetterAliyunDoc] Required elements not found, aborting');
        return;
    }

    // 定义宽度范围和步进值
    const MIN_WIDTH = 20;  // 最小宽度 20%
    const MAX_WIDTH = 100; // 最大宽度 100%
    const STEP = 10;       // 每次调整 10%
    const SIDEBAR_WIDTH = 240; // 侧边栏宽度

    // 获取当前宽度
    let currentWidth = window.__betterAliyunDoc.contentWidth;
    console.log('[BetterAliyunDoc] Current width:', currentWidth);
    console.log('[BetterAliyunDoc] Current width before adjustment:', currentWidth);

    // 确保 currentWidth 是有效的
    if (isNaN(currentWidth) || currentWidth < 0) {
        console.warn('[BetterAliyunDoc] Invalid currentWidth, setting to default value of 70');
        currentWidth = 70; // 默认值
    }

    // 应用过渡效果和宽度
    const adjustWidth = (width) => {
        // 确保宽度在有效范围内
        width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
        
        // 设置容器样式
        container.style.setProperty('display', 'flex', 'important');
        container.style.setProperty('justify-content', 'center', 'important');
        container.style.setProperty('align-items', 'flex-start', 'important');
        container.style.setProperty('width', '100%', 'important');
        container.style.setProperty('position', 'relative', 'important');
        container.style.setProperty('overflow', 'hidden', 'important');
        
        // 为所有元素添加过渡效果
        const elements = [content, leftSidebar, rightSidebar].filter(el => el);
        elements.forEach(el => {
            el.style.transition = 'all 0.3s ease';
        });

        // 计算宽度
        const widthPx = (window.innerWidth * width) / 100;
        const widthStr = `${width}%`;
        
        // 调整所有元素的基础样式
        if (leftSidebar) {
            leftSidebar.style.setProperty('position', 'relative', 'important');
            leftSidebar.style.setProperty('flex', `0 0 ${SIDEBAR_WIDTH}px`, 'important');
        }
        
        content.style.setProperty('position', 'relative', 'important');
        content.style.setProperty('flex', `0 1 ${widthStr}`, 'important');
        content.style.setProperty('min-width', '0', 'important'); // 允许内容区域收缩
        content.style.setProperty('margin', '0', 'important');
        
        if (rightSidebar) {
            rightSidebar.style.setProperty('position', 'relative', 'important');
            rightSidebar.style.setProperty('flex', `0 0 ${SIDEBAR_WIDTH}px`, 'important');
        }
        
        // 根据内容宽度调整侧边栏
        if (width >= 90) {
            // 内容区域很宽时，完全隐藏两侧边栏
            if (leftSidebar) {
                leftSidebar.style.setProperty('margin-left', `-${SIDEBAR_WIDTH}px`, 'important');
                leftSidebar.style.setProperty('opacity', '0', 'important');
                leftSidebar.style.setProperty('pointer-events', 'none', 'important');
            }
            if (rightSidebar) {
                rightSidebar.style.setProperty('margin-right', `-${SIDEBAR_WIDTH}px`, 'important');
                rightSidebar.style.setProperty('opacity', '0', 'important');
                rightSidebar.style.setProperty('pointer-events', 'none', 'important');
            }
        } else if (width >= 70) {
            // 内容区域较宽时，部分隐藏两侧边栏
            const overlap = Math.max(0, (widthPx + 2 * SIDEBAR_WIDTH - window.innerWidth) / 2);
            if (leftSidebar) {
                leftSidebar.style.setProperty('margin-left', `-${overlap}px`, 'important');
                leftSidebar.style.setProperty('opacity', '0.5', 'important');
                leftSidebar.style.setProperty('pointer-events', 'none', 'important');
            }
            if (rightSidebar) {
                rightSidebar.style.setProperty('margin-right', `-${overlap}px`, 'important');
                rightSidebar.style.setProperty('opacity', '0.5', 'important');
                rightSidebar.style.setProperty('pointer-events', 'none', 'important');
            }
        } else {
            // 内容区域较窄时，完全显示两侧边栏
            if (leftSidebar) {
                leftSidebar.style.setProperty('margin-left', '0', 'important');
                leftSidebar.style.setProperty('opacity', '1', 'important');
                leftSidebar.style.setProperty('pointer-events', 'auto', 'important');
            }
            if (rightSidebar) {
                rightSidebar.style.setProperty('margin-right', '0', 'important');
                rightSidebar.style.setProperty('opacity', '1', 'important');
                rightSidebar.style.setProperty('pointer-events', 'auto', 'important');
            }
        }
        
        console.log('[BetterAliyunDoc] Adjusted content width to:', widthStr);
        
        // 保存当前状态
        window.__betterAliyunDoc.contentWidth = width;
    };

    // 根据模式调整宽度
    let newWidth;
    if (mode === 'narrow') {
        // 向左收窄
        newWidth = currentWidth - STEP;
        console.log('[BetterAliyunDoc] Narrowing from', currentWidth, 'to', newWidth);
    } else if (mode === 'wide') {
        // 向右扩展
        newWidth = currentWidth + STEP;
        console.log('[BetterAliyunDoc] Widening from', currentWidth, 'to', newWidth);
    }

    // 应用新宽度
    adjustWidth(newWidth);
    console.log('[BetterAliyunDoc] Adjusting content width to:', newWidth);
}

// 获取布局相关的DOM元素
function getLayoutElements() {
    return {
        content: document.querySelector('.aliyun-docs-content'),
        leftSidebar: document.querySelector('.Menu--helpMenuBox--rvBkNtL'),
        rightSidebar: document.querySelector('.aliyun-docs-side'),
        container: document.querySelector('.aliyun-docs-content')?.parentElement
    };
}

// 计算新的宽度
function calculateNewWidth(currentWidth, mode) {
    if (mode === 'narrow') {
        return Math.max(LAYOUT_CONSTANTS.MIN_WIDTH, currentWidth - LAYOUT_CONSTANTS.STEP);
    } else if (mode === 'wide') {
        return Math.min(LAYOUT_CONSTANTS.MAX_WIDTH, currentWidth + LAYOUT_CONSTANTS.STEP);
    }
    return currentWidth;
}

// 应用宽度调整
function adjustWidth(width, elements) {
    const { content, leftSidebar, rightSidebar, container } = elements;
    width = Math.max(LAYOUT_CONSTANTS.MIN_WIDTH, Math.min(LAYOUT_CONSTANTS.MAX_WIDTH, width));

    applyContainerStyles(container);
    applyTransitionEffects([content, leftSidebar, rightSidebar]);
    adjustElementWidths(width, elements);

    window.__betterAliyunDoc.contentWidth = width;
    console.log('[BetterAliyunDoc] Adjusted content width to:', `${width}%`);
}

// 应用容器样式
function applyContainerStyles(container) {
    const styles = {
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'flex-start',
        'width': '100%',
        'position': 'relative',
        'overflow': 'hidden'
    };

    Object.entries(styles).forEach(([prop, value]) => {
        container.style.setProperty(prop, value, 'important');
    });
}

// 应用过渡效果
function applyTransitionEffects(elements) {
    elements.filter(Boolean).forEach(el => {
        el.style.transition = 'all 0.3s ease';
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
            'margin-left': `-${LAYOUT_CONSTANTS.SIDEBAR_WIDTH}px`,
            'opacity': '0',
            'pointer-events': 'none'
        },
        right: {
            ...baseStyles,
            'margin-right': `-${LAYOUT_CONSTANTS.SIDEBAR_WIDTH}px`,
            'opacity': '0',
            'pointer-events': 'none'
        }
    };
}

// 获取部分隐藏的侧边栏样式
function getPartiallyHiddenSidebarStyles(baseStyles, widthPx) {
    const overlap = Math.max(0, (widthPx + 2 * LAYOUT_CONSTANTS.SIDEBAR_WIDTH - window.innerWidth) / 2);
    return {
        left: {
            ...baseStyles,
            'margin-left': `-${overlap}px`,
            'opacity': '0.5',
            'pointer-events': 'none'
        },
        right: {
            ...baseStyles,
            'margin-right': `-${overlap}px`,
            'opacity': '0.5',
            'pointer-events': 'none'
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
        'flex': `0 1 ${width}%`,
        'min-width': '0',
        'margin': '0'
    };

    Object.entries(contentStyles).forEach(([prop, value]) => {
        content.style.setProperty(prop, value, 'important');
    });
}

// 收起或显示左侧边栏的函数
function toggleLeftSidebar() {
    const leftSidebar = document.querySelector('.Menu--helpMenuBox--rvBkNtL');
    const content = document.querySelector('.aliyun-docs-content');
    if (leftSidebar) {
        if (leftSidebar.style.display === 'none') {
            leftSidebar.style.display = 'block'; // 显示左侧边栏
            content.style.marginLeft = '0'; // 恢复时不设置左边距，让内容区域自动贴边
            content.style.width = 'calc(100% - 240px)'; // 恢复内容区域宽度
        } else {
            leftSidebar.style.display = 'none'; // 收起左侧边栏
            content.style.marginLeft = '0'; // 收起时清除左边距
            content.style.width = '100%'; // 扩展内容区域宽度
        }
    }
}

// 收起或显示右侧边栏的函数
function toggleRightSidebar() {
    const rightSidebar = document.querySelector('.aliyun-docs-side');
    const content = document.querySelector('.aliyun-docs-content');
    const contentWrapper = document.querySelector('.aliyun-docs-content-wrapper');
    
    if (rightSidebar) {
        if (rightSidebar.style.display === 'none') {
            rightSidebar.style.display = 'block'; // 显示右侧边栏
            content.style.marginRight = '0'; // 恢复时不设置右边距，让内容区域自动贴边
            content.style.width = 'calc(100% - 240px)'; // 恢复内容区域宽度
            if (contentWrapper) {
                contentWrapper.style.width = ''; // 恢复默认宽度
            }
        } else {
            rightSidebar.style.display = 'none'; // 收起右侧边栏
            content.style.marginRight = '0'; // 收起时清除右边距
            content.style.width = '100%'; // 扩展内容区域宽度
            if (contentWrapper) {
                contentWrapper.style.width = '100%'; // 扩展包装容器宽度
            }
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

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.layout = {
    adjustLayout: adjustLayout,
    adjustSidebars: adjustSidebars,
    toggleLeftSidebar: toggleLeftSidebar,
    toggleRightSidebar: toggleRightSidebar
};
