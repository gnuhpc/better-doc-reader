// 初始化全局状态
window.initializeGlobalState = function() {
    console.log('[BetterAliyunDoc] Initializing global state');
    
    // 初始化全局对象
    window.__betterAliyunDoc = window.__betterAliyunDoc || {
        initialized: false,
        isContentOnly: false,
        isDarkMode: false,
        isWideContent: false,
        originalHTML: null,
        originalStyles: null
    };
    window.__betterAliyunDoc.contentWidth = 70; // 初始内容宽度为70%
};

// 初始化扩展
window.initializeBetterAliyunDoc = function() {
    console.log('[BetterAliyunDoc] Initializing...');
    
    // 防止重复初始化
    if (window.__betterAliyunDoc && window.__betterAliyunDoc.initialized) {
        console.log('[BetterAliyunDoc] Already initialized, skipping');
        return;
    }

    // 初始化全局状态
    window.initializeGlobalState();
    
    // 在初始化时绑定键盘事件
    document.addEventListener('keydown', window.BetterAliyunDoc.keyboard.handleKeyDown);
    console.log('[BetterAliyunDoc] Keyboard event listener added for keydown events');
    console.log('[BetterAliyunDoc] Keyboard event listener added for keydown events');
    
    // 标记为已初始化
    window.__betterAliyunDoc.initialized = true;
    
    console.log('[BetterAliyunDoc] Initialization complete');
};

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.init = {
    initializeBetterAliyunDoc: window.initializeBetterAliyunDoc,
    initializeGlobalState: window.initializeGlobalState
};
