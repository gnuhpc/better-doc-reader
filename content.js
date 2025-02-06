(function() {
    // 检查是否已经初始化
    if (typeof window.__betterAliyunDoc === 'undefined') {
        window.__betterAliyunDoc = {
            isContentOnly: false,
            originalHTML: '',
            originalStyles: null
        };

        // 检查页面是否可以被提取
        function checkPage() {
            const content = document.querySelector('.aliyun-docs-content');
            const isExtractable = content !== null;
            
            // 向 background script 报告页面状态
            chrome.runtime.sendMessage({
                type: 'pageCheckResult',
                isExtractable: isExtractable
            });

            return isExtractable;
        }

        // 切换内容显示模式
        function toggleContent() {
            const content = document.querySelector('.aliyun-docs-content');
            if (!content) {
                console.log('No content found to extract');
                return;
            }

            if (!window.__betterAliyunDoc.isContentOnly) {
                // 保存原始状态
                window.__betterAliyunDoc.originalHTML = document.body.innerHTML;
                window.__betterAliyunDoc.originalStyles = document.body.getAttribute('style');

                // 创建新的内容容器
                const container = document.createElement('div');
                container.style.cssText = `
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                `;
                container.appendChild(content.cloneNode(true));
                
                // 清空并重设页面
                document.body.innerHTML = '';
                document.body.style.cssText = 'background-color: #fff; margin: 0; padding: 0;';
                document.body.appendChild(container);
                
                window.__betterAliyunDoc.isContentOnly = true;
            } else {
                // 恢复原始状态
                document.body.innerHTML = window.__betterAliyunDoc.originalHTML;
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
            if (message.action === 'toggleContent') {
                toggleContent();
                sendResponse({ success: true });
            }
        });

        // 初始检查页面
        checkPage();
    }
})();
