// 跟踪注入状态
const injectedTabs = new Set();
const extractablePages = new Set();

// 监听命令
chrome.commands.onCommand.addListener((command) => {
    console.log('[BetterAliyunDoc] Command received:', command);
    
    // 向当前标签页发送消息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            console.log('[BetterAliyunDoc] Sending message to tab:', tabs[0].id, 'with command:', command);
            chrome.tabs.sendMessage(tabs[0].id, { command: command }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('[BetterAliyunDoc] Error:', chrome.runtime.lastError);
                } else {
                    console.log('[BetterAliyunDoc] Response:', response);
                }
            });
        }
    });
});

// 处理键盘快捷键
chrome.commands.onCommand.addListener(async (command) => {
    console.log('Command received:', command);  // 添加日志
    if (command === 'toggle-view') {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (tab) {
            handleToggle(tab);
        }
    }
});

// 处理点击和快捷键的共同逻辑
async function handleToggle(tab) {
    try {
        console.log('Handle toggle for tab:', tab.id);  // 添加日志
        // 检查是否已经注入过
        if (!injectedTabs.has(tab.id)) {
            // 首次注入内容脚本
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
            injectedTabs.add(tab.id);
        }

        // 发送消息到内容脚本
        try {
            const response = await chrome.tabs.sendMessage(tab.id, {action: 'toggleContent'});
            console.log('Toggle response:', response);
        } catch (error) {
            console.error('Error sending message to content script:', error);
            // 如果发送消息失败，可能是content script没有正确加载，尝试重新注入
            injectedTabs.delete(tab.id);
            await handleToggle(tab);
        }
    } catch (error) {
        console.error('Error in handleToggle:', error);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'pageCheckResult') {
        if (message.isExtractable) {
            extractablePages.add(sender.tab.id);
            // 设置红点图标
            chrome.action.setIcon({
                path: {
                    "16": "icons/icon-16-dot.png",
                    "48": "icons/icon-48-dot.png",
                    "128": "icons/icon-128-dot.png"
                },
                tabId: sender.tab.id
            });
        } else {
            extractablePages.delete(sender.tab.id);
            // 设置普通图标
            chrome.action.setIcon({
                path: {
                    "16": "icons/icon-16.png",
                    "48": "icons/icon-48.png",
                    "128": "icons/icon-128.png"
                },
                tabId: sender.tab.id
            });
        }
    } else if (message.type === 'contentState') {
        // 根据内容状态更新图标
        const iconType = message.isContentOnly ? '-active' : message.isExtractable ? '-dot' : '';
        chrome.action.setIcon({
            path: {
                "16": `icons/icon-16${iconType}.png`,
                "48": `icons/icon-48${iconType}.png`,
                "128": `icons/icon-128${iconType}.png`
            },
            tabId: sender.tab.id
        });
    }
});

// 处理图标点击
chrome.action.onClicked.addListener(handleToggle);

// 当标签页更新时，重新检查页面
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // 移除注入状态
        injectedTabs.delete(tabId);
        extractablePages.delete(tabId);
    }
});

// 当标签页关闭时，清理状态
chrome.tabs.onRemoved.addListener((tabId) => {
    injectedTabs.delete(tabId);
    extractablePages.delete(tabId);
});
