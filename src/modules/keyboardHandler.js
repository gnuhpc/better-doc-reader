// 处理键盘事件的函数
function handleKeyDown(e) {
    console.log('[BetterAliyunDoc] handleKeyDown triggered');
    // 打印所有按键信息，帮助调试
    console.log('[BetterAliyunDoc] Keydown event details:', {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        altKey: e.altKey,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        type: e.type,
        target: e.target.tagName
    });

    console.log('[BetterAliyunDoc] Key pressed:', e.key);

    // 检查是否按下 Option/Alt 键
    if (e.altKey) {
        if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
            // Option + 左箭头：缩小正文区域
            console.log('[BetterAliyunDoc] Option + Left Arrow pressed');
            e.preventDefault();
            e.stopPropagation();
            adjustSidebars('narrow');
            return false;
        } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
            // Option + 右箭头：扩大正文区域
            console.log('[BetterAliyunDoc] Option + Right Arrow pressed');
            e.preventDefault();
            e.stopPropagation();
            adjustSidebars('wide');
            return false;
        }
    }
}

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.keyboard = {
    handleKeyDown: handleKeyDown
};

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.keyboard = {
    handleKeyDown: window.handleKeyDown
};
