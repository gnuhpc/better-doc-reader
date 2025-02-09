console.log('[BetterAliyunDoc] Content script loaded');

// 初始化全局对象
window.BetterAliyunDoc = window.BetterAliyunDoc || {};

// 直接添加键盘事件监听器
function handleKeyboardEvent(e) {
    console.log('[BetterAliyunDoc] Keydown event fired:', e.key, e.code);
    
    // 检查是否按下 Option/Alt 键
    if (e.altKey) {
        console.log('[BetterAliyunDoc] Alt key pressed with:', e.key);
        if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
            console.log('[BetterAliyunDoc] Executing: narrow layout');
            e.preventDefault();
            e.stopPropagation();
            const leftSidebar = document.querySelector('.aliyun-docs-catalog');
            const rightSidebar = document.querySelector('.aliyun-docs-navigator');
            const content = document.querySelector('.aliyun-docs-content');
            
            if (leftSidebar) leftSidebar.style.width = '';
            if (rightSidebar) rightSidebar.style.width = '';
            if (content) content.style.maxWidth = '';
            
            return false;
        } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
            console.log('[BetterAliyunDoc] Executing: wide layout');
            e.preventDefault();
            e.stopPropagation();
            const leftSidebar = document.querySelector('.aliyun-docs-catalog');
            const rightSidebar = document.querySelector('.aliyun-docs-navigator');
            const content = document.querySelector('.aliyun-docs-content');
            
            if (leftSidebar) leftSidebar.style.width = '0';
            if (rightSidebar) rightSidebar.style.width = '0';
            if (content) content.style.maxWidth = '100%';
            
            return false;
        }
    }
}

// 立即添加事件监听器
document.addEventListener('keydown', handleKeyboardEvent, true);

// 使用 MutationObserver 监听 DOM 变化
const contentObserver = new MutationObserver((mutations) => {
    const contentElement = document.querySelector('.aliyun-docs-content');
    if (contentElement) {
        console.log('[BetterAliyunDoc] Content element found');
        contentObserver.disconnect();
    }
});

// 开始观察 DOM 变化
contentObserver.observe(document.body, { childList: true, subtree: true });

// 监听来自 background script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[BetterAliyunDoc] Received message:', message);
    
    if (message.command === 'toggle-dark-mode') {
        console.log('[BetterAliyunDoc] Toggling dark mode via message');
        if (window.BetterAliyunDoc && window.BetterAliyunDoc.darkMode) {
            window.BetterAliyunDoc.darkMode.toggleDarkMode();
            sendResponse({ success: true });
        } else {
            console.error('[BetterAliyunDoc] Dark mode module not loaded');
            sendResponse({ success: false, error: 'Dark mode module not loaded' });
        }
    } else if (message.command === 'toggle-view' || message.action === 'toggleContent') {
        console.log('[BetterAliyunDoc] Toggling content view');
        if (window.BetterAliyunDoc && window.BetterAliyunDoc.content) {
            window.BetterAliyunDoc.content.toggleContent();
            sendResponse({ success: true });
        } else {
            console.error('[BetterAliyunDoc] Content module not loaded');
            sendResponse({ success: false, error: 'Content module not loaded' });
        }
    } else if (message.action === 'toggleLeftSidebar') {
        console.log('[BetterAliyunDoc] Toggling left sidebar');
        if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
            window.BetterAliyunDoc.layout.toggleLeftSidebar();
        }
        sendResponse({ success: true });
    } else if (message.action === 'toggleRightSidebar') {
        console.log('[BetterAliyunDoc] Toggling right sidebar');
        if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
            window.BetterAliyunDoc.layout.toggleRightSidebar();
        }
        sendResponse({ success: true });
    } else if (message.command === 'collapse-left-sidebar') {
        console.log('[BetterAliyunDoc] Collapsing left sidebar');
        if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
            window.BetterAliyunDoc.layout.collapseLeftSidebar();
        }
        sendResponse({ success: true });
    } else if (message.command === 'collapse-right-sidebar') {
        console.log('[BetterAliyunDoc] Collapsing right sidebar');
        if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
            window.BetterAliyunDoc.layout.collapseRightSidebar();
        }
        sendResponse({ success: true });
    } else if (message.command === 'widen-content') {
        console.log('[BetterAliyunDoc] Widening content');
        if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
            window.BetterAliyunDoc.layout.adjustSidebars('wide');
        }
        sendResponse({ status: 'success' });
    } else if (message.command === 'narrow-content') {
        console.log('[BetterAliyunDoc] Narrowing content');
        if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
            window.BetterAliyunDoc.layout.adjustSidebars('narrow');
        }
        sendResponse({ status: 'success' });
    }
    return true; // 保持消息通道开放
});

// 确保在 DOM 加载完成后也添加事件监听器
document.addEventListener('DOMContentLoaded', () => {
    console.log('[BetterAliyunDoc] DOM Content Loaded');
    document.addEventListener('keydown', handleKeyboardEvent, true);

    console.log('[BetterAliyunDoc] DOMContentLoaded event fired');

    // 初始化扩展
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.init) {
        window.BetterAliyunDoc.init.initializeBetterAliyunDoc();
    } else {
        console.error('[BetterAliyunDoc] Init module not loaded');
    }

    // 添加键盘事件监听器
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.keyboard) {
        console.log('[BetterAliyunDoc] Adding keyboard event listener');
        document.addEventListener('keydown', (e) => {
            if (window.BetterAliyunDoc.keyboard.handleKeyDown) {
                window.BetterAliyunDoc.keyboard.handleKeyDown(e);
            }
        });
    } else {
        console.error('[BetterAliyunDoc] Keyboard module not loaded');
    }

    // 使用 MutationObserver 监听 DOM 变化
    const contentObserver = new MutationObserver((mutations) => {
        const contentElement = document.querySelector('.aliyun-docs-content');
        if (contentElement) {
            contentObserver.disconnect();
            if (window.BetterAliyunDoc && window.BetterAliyunDoc.init) {
                window.BetterAliyunDoc.init.initializeBetterAliyunDoc();
            }
        }
    });

    // 开始观察 DOM 变化
    contentObserver.observe(document.body, { childList: true, subtree: true });

    // 在窗口大小变化时调整布局
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.layout) {
        window.addEventListener('resize', window.BetterAliyunDoc.layout.adjustLayout);
    }

    // 检查页面是否可以被提取
    if (window.BetterAliyunDoc && window.BetterAliyunDoc.content) {
        window.BetterAliyunDoc.content.checkPage();
    }
});

// 检查深色模式状态并应用样式
function applyDarkModeOnLoad() {
    if (window.__betterAliyunDoc && window.__betterAliyunDoc.isDarkMode) {
        console.log('[BetterAliyunDoc] Applying dark mode on new page');
        // 应用深色模式样式
        const styleElement = document.createElement('style');
        styleElement.id = 'better-aliyun-doc-dark-mode';
        styleElement.textContent = `
            body {
                background-color: #1a1b2e !important;
                color: #ffffff !important;
            }
            .aliyun-docs-content {
                background-color: #1a1b2e !important;
                color: #ffffff !important;
            }
            .aliyun-docs-content h1,
            .aliyun-docs-content h2,
            .aliyun-docs-content h3,
            .aliyun-docs-content h4,
            .aliyun-docs-content h5,
            .aliyun-docs-content h6 {
                color: #ffffff !important;
            }
            .aliyun-docs-content a {
                color: #58a6ff !important;
            }
            .aliyun-docs-content table {
                border-color: #30363d !important;
            }
            .aliyun-docs-content th {
                background-color: #21262d !important;
                color: #ffffff !important;
                border-color: #30363d !important;
            }
            .aliyun-docs-content td {
                border-color: #30363d !important;
            }
            .aliyun-docs-content code,
            .aliyun-docs-content pre {
                background-color: #2d2d2d !important;
                color: #e6e6e6 !important;
            }
            .aliyun-docs-menu {
                background-color: #1a1b2e !important;
                color: #ffffff !important;
            }
            .aliyun-docs-side {
                background-color: #1a1b2e !important;
                color: #ffffff !important;
            }
        `;
        document.head.appendChild(styleElement);

        // 额外处理 .aliyun-docs-content 的所有子元素
        applyDarkModeToSpecificElements();
    }
}

// 创建 MutationObserver 以监视 .aliyun-docs-content 的变化
const darkModeObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            applyDarkModeToSpecificElements(); // 应用深色模式样式
        }
    });
});

// 开始观察 .aliyun-docs-content
const contentDiv = document.querySelector('.aliyun-docs-content');
if (contentDiv) {
    darkModeObserver.observe(contentDiv, {
        childList: true,
        subtree: true // 观察所有子节点的变化
    });
}

// 在 DOMContentLoaded 事件中调用 applyDarkModeOnLoad
document.addEventListener('DOMContentLoaded', applyDarkModeOnLoad);

// 处理 collapse-left-sidebar 和 collapse-right-sidebar 消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'collapse-left-sidebar') {
        toggleLeftSidebar();
        sendResponse({ success: true });
    } else if (message.command === 'collapse-right-sidebar') {
        toggleRightSidebar();
        sendResponse({ success: true });
    }
});
