// 跟踪注入状态
const injectedTabs = new Set();
const extractablePages = new Set();

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

chrome.action.onClicked.addListener(async (tab) => {
    try {
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
        const response = await chrome.tabs.sendMessage(tab.id, {action: 'toggleContent'});
        console.log('Toggle response:', response);
    } catch (error) {
        console.error('Error:', error);
    }
});

// 当标签页更新时，重新检查页面
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url?.includes('aliyun.com')) {
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.js']
        });
        injectedTabs.add(tabId);
    }
});

// 当标签页关闭时，清理状态
chrome.tabs.onRemoved.addListener((tabId) => {
    injectedTabs.delete(tabId);
    extractablePages.delete(tabId);
});
