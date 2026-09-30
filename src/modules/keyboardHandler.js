// 创建一个自执行函数来初始化键盘处理器
(function() {
  // 只在顶层窗口运行，避免 iframe 重复处理键盘事件
  if (window !== window.top) {
    return;
  }

  // 严格限制只在阿里云官方文档页面生效，控制台等页面直接退出
  if (window.BetterAliyunDoc?.isDocumentationPage && !window.BetterAliyunDoc.isDocumentationPage()) {
    return;
  }

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
      if (window.BetterAliyunDoc?.isDocumentationPage && !window.BetterAliyunDoc.isDocumentationPage()) {
        return;
      }

      // 避免在输入框或文本编辑区中误触快捷键
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (!this.checkDependencies()) {
        return;
      }

      // 检查是否按下 Option/Alt 键
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        // 处理侧边栏快捷键：支持 Alt + L / Option + [
        if (e.key === '[' || e.code === 'BracketLeft' || e.key === 'l' || e.key === 'L' || e.code === 'KeyL') {
          console.log('[BetterAliyunDoc] Option + L / [ pressed');
          e.preventDefault();
          e.stopPropagation();
          window.BetterAliyunDoc.layout.toggleLeftSidebar();
          return false;
        } else if (e.key === 'r' || e.key === 'R' || e.code === 'KeyR') {
          // Alt + R 重置页面布局到官方默认页面
          console.log('[BetterAliyunDoc] Option + R pressed: Reset to official layout');
          e.preventDefault();
          e.stopPropagation();
          window.BetterAliyunDoc.layout.resetToOfficialLayout();
          return false;
        } else if (e.key === ']' || e.code === 'BracketRight') {
          // Option + ] 收起/恢复右侧边栏
          console.log('[BetterAliyunDoc] Option + ] pressed');
          e.preventDefault();
          e.stopPropagation();
          window.BetterAliyunDoc.layout.toggleRightSidebar();
          return false;
        } else if (e.key === 'f' || e.key === 'F' || e.code === 'KeyF') {
          // 处理视图切换快捷键：Alt + F
          console.log('[BetterAliyunDoc] Option + F pressed');
          e.preventDefault();
          e.stopPropagation();
          if (window.BetterAliyunDoc.content) {
            window.BetterAliyunDoc.content.toggleContent();
          }
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

  // 添加单个键盘事件监听器，使用捕获阶段确保优先拦截
  console.log('[BetterAliyunDoc] Initializing keyboard handler');
  document.addEventListener('keydown', (e) => {
    window.BetterAliyunDoc?.keyboard?.handleKeyDown(e);
  }, true);
  console.log('[BetterAliyunDoc] Keyboard handler is ready');
})();
