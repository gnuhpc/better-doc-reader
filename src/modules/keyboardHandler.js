// 创建一个自执行函数来初始化键盘处理器
(function() {
  console.log('[BetterAliyunDoc] Loading keyboard handler module...');
  // 确保 BetterAliyunDoc 命名空间存在
  window.BetterAliyunDoc = window.BetterAliyunDoc || {};

  // 定义键盘处理模块
  window.BetterAliyunDoc.keyboard = {
    // 检查布局模块是否可用
    checkDependencies: function() {
      if (!window.BetterAliyunDoc.layout) {
        console.error('[BetterAliyunDoc] Layout module not found. Keyboard shortcuts may not work.');
        return false;
      }
      return true;
    },

    // 处理键盘事件的函数
    handleKeyDown: function(e) {
      if (!this.checkDependencies()) {
        return;
      }
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
        // 处理侧边栏快捷键
        if (e.key === '[' || e.code === 'BracketLeft') {
          // Option + [：切换左侧边栏
          console.log('[BetterAliyunDoc] Option + [ pressed');
          e.preventDefault();
          e.stopPropagation();
          window.BetterAliyunDoc.layout.toggleLeftSidebar();
          return false;
        } else if (e.key === ']' || e.code === 'BracketRight') {
          // Option + ]：切换右侧边栏
          console.log('[BetterAliyunDoc] Option + ] pressed');
          e.preventDefault();
          e.stopPropagation();
          window.BetterAliyunDoc.layout.toggleRightSidebar();
          return false;
        }
        // 处理内容区域宽度调整快捷键
        if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
          // Option + 左箭头：缩小正文区域
          console.log('[BetterAliyunDoc] Option + Left Arrow pressed');
          e.preventDefault();
          e.stopPropagation();
          window.BetterAliyunDoc.layout.adjustSidebars('narrow');
          return false;
        } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
          // Option + 右箭头：扩大正文区域
          console.log('[BetterAliyunDoc] Option + Right Arrow pressed');
          e.preventDefault();
          e.stopPropagation();
          window.BetterAliyunDoc.layout.adjustSidebars('wide');
          return false;
        }
      }
    }
  };

  // 立即添加键盘事件监听器，不等待 DOMContentLoaded
  console.log('[BetterAliyunDoc] Initializing keyboard handler');
  document.addEventListener('keydown', window.BetterAliyunDoc.keyboard.handleKeyDown.bind(window.BetterAliyunDoc.keyboard), true);

  // 确保在 DOMContentLoaded 后也添加事件监听器（以防第一次添加时文档还未准备好）
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[BetterAliyunDoc] Re-adding keyboard event listener after DOMContentLoaded');
    // 先移除之前的监听器，避免重复
    document.removeEventListener('keydown', window.BetterAliyunDoc.keyboard.handleKeyDown, true);
    document.addEventListener('keydown', window.BetterAliyunDoc.keyboard.handleKeyDown.bind(window.BetterAliyunDoc.keyboard), true);
    console.log('[BetterAliyunDoc] Keyboard handler is ready');
  });
})();
