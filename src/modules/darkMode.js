// 深色模式样式配置
const darkModeStyles = {
    background: '#1a1b2e',      // 深蓝色背景
    text: '#ffffff',            // 白色文字
    link: '#58a6ff',           // 蓝色链接
    border: '#30363d',         // 深灰色边框
    code: {
        background: '#2d2d2d',  // 代码块背景
        text: '#e6e6e6'         // 代码文字颜色
    },
    table: {
        header: '#21262d',      // 表头背景
        row: '#1a1b2e',         // 行背景
        altRow: '#161b22',      // 交替行背景
        border: '#30363d'       // 表格边框
    }
};

// 应用深色模式到搜索结果
function applyDarkModeToSearchResults(container) {
    if (!container) return;

    const elements = container.querySelectorAll('.search-result-item');
    elements.forEach(item => {
        item.style.backgroundColor = darkModeStyles.background;
        item.style.color = darkModeStyles.text;
        
        // 处理链接
        const links = item.querySelectorAll('a');
        links.forEach(link => {
            link.style.color = darkModeStyles.link;
        });
    });
}

// 应用深色模式到帮助文档内容
function applyDarkModeToHelpDocsContent(content) {
    if (!content) return;

    content.style.backgroundColor = darkModeStyles.background;
    content.style.color = darkModeStyles.text;

    // 处理链接
    const links = content.querySelectorAll('a');
    links.forEach(link => {
        link.style.color = darkModeStyles.link;
    });

    // 处理代码块
    const codeBlocks = content.querySelectorAll('pre, code');
    codeBlocks.forEach(block => {
        block.style.backgroundColor = darkModeStyles.code.background;
        block.style.color = darkModeStyles.code.text;
    });
}

// 应用深色模式到通知区域
function applyDarkModeToNoticeDivs() {
    const noticeDivs = document.querySelectorAll('div[type="notice"]');
    noticeDivs.forEach(div => {
        div.style.backgroundColor = darkModeStyles.background;
        div.style.color = darkModeStyles.text;
        div.style.borderColor = darkModeStyles.border;
    });
}

// 应用表格样式
function applyTableStyles(table, styles = darkModeStyles.table) {
    if (!table) return;

    // 设置表格边框
    table.style.borderColor = styles.border;
    
    // 处理表头
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
        header.style.backgroundColor = styles.header;
        header.style.color = darkModeStyles.text;
        header.style.borderColor = styles.border;
    });

    // 处理表格行
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.style.backgroundColor = index % 2 === 0 ? styles.row : styles.altRow;
        
        // 处理单元格
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            cell.style.borderColor = styles.border;
            cell.style.color = darkModeStyles.text;
        });
    });
}

// 应用深色模式到特定的元素
function applyDarkModeToSpecificElements() {
    // 应用深色模式到左侧边栏
    const leftSidebar = document.querySelector('.aliyun-docs-menu');
    if (leftSidebar) {
        leftSidebar.style.backgroundColor = darkModeStyles.background;
        leftSidebar.style.color = darkModeStyles.text;
        const leftChildElements = leftSidebar.querySelectorAll('*');
        leftChildElements.forEach(child => {
            child.style.backgroundColor = darkModeStyles.background;
            child.style.color = darkModeStyles.text;
        });
    }

    // 应用深色模式到右侧边栏和正文
    const rightSidebar = document.querySelector('.aliyun-docs-view');
    if (rightSidebar) {
        rightSidebar.style.backgroundColor = darkModeStyles.background;
        rightSidebar.style.color = darkModeStyles.text;
        const rightChildElements = rightSidebar.querySelectorAll('*');
        rightChildElements.forEach(child => {
            child.style.backgroundColor = darkModeStyles.background;
            child.style.color = darkModeStyles.text;
        });
    }

    // 应用深色模式到所有表格及其子元素
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        table.style.backgroundColor = darkModeStyles.background;
        table.style.color = darkModeStyles.text;
        const tableChildElements = table.querySelectorAll('*');
        tableChildElements.forEach(child => {
            child.style.backgroundColor = darkModeStyles.background;
            child.style.color = darkModeStyles.text;
        });
    });

    // 应用深色模式到 type="note" 的 div 及其子元素
    const noteDivs = document.querySelectorAll('div[type="note"]');
    noteDivs.forEach(div => {
        div.style.backgroundColor = darkModeStyles.background;
        div.style.color = darkModeStyles.text;
        const noteChildElements = div.querySelectorAll('*');
        noteChildElements.forEach(child => {
            child.style.backgroundColor = darkModeStyles.background;
            child.style.color = darkModeStyles.text;
        });
    });

    // 应用深色模式到搜索结果容器
    const resultContainers = document.querySelectorAll('div[class^="MenuSearch--resultContainer"]');
    resultContainers.forEach(container => {
        container.style.backgroundColor = darkModeStyles.background;
        container.style.color = darkModeStyles.text;
    });
}

console.log('[BetterAliyunDoc] Dark mode module loading');

// 初始化全局状态
window.__betterAliyunDoc = window.__betterAliyunDoc || {
    isDarkMode: false
};

// 切换深色模式
function toggleDarkMode() {
    console.log('[BetterAliyunDoc] Toggling dark mode');
    
    // 获取或创建样式元素
    let styleElement = document.getElementById('better-aliyun-doc-dark-mode');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'better-aliyun-doc-dark-mode';
        document.head.appendChild(styleElement);
    }

    // 切换深色模式状态
    window.__betterAliyunDoc.isDarkMode = !window.__betterAliyunDoc.isDarkMode;

    if (window.__betterAliyunDoc.isDarkMode) {
        // 应用深色模式样式
        styleElement.textContent = `
            body {
                background-color: ${darkModeStyles.background} !important;
                color: ${darkModeStyles.text} !important;
            }
            .aliyun-docs-content {
                background-color: ${darkModeStyles.background} !important;
                color: ${darkModeStyles.text} !important;
            }
            .aliyun-docs-content h1,
            .aliyun-docs-content h2,
            .aliyun-docs-content h3,
            .aliyun-docs-content h4,
            .aliyun-docs-content h5,
            .aliyun-docs-content h6 {
                color: ${darkModeStyles.text} !important;
            }
            .aliyun-docs-content a {
                color: ${darkModeStyles.link} !important;
            }
            .aliyun-docs-content table {
                border-color: ${darkModeStyles.border} !important;
            }
            .aliyun-docs-content th {
                background-color: ${darkModeStyles.table.header} !important;
                color: ${darkModeStyles.text} !important;
                border-color: ${darkModeStyles.border} !important;
            }
            .aliyun-docs-content td {
                border-color: ${darkModeStyles.border} !important;
            }
            .aliyun-docs-content code,
            .aliyun-docs-content pre {
                background-color: ${darkModeStyles.code.background} !important;
                color: ${darkModeStyles.code.text} !important;
            }
            .aliyun-docs-menu {
                background-color: ${darkModeStyles.background} !important;
                color: ${darkModeStyles.text} !important;
            }
            .aliyun-docs-side {
                background-color: ${darkModeStyles.background} !important;
                color: ${darkModeStyles.text} !important;
            }
        `;
        console.log('[BetterAliyunDoc] Dark mode enabled');

        // 额外处理 .aliyun-docs-content 的所有子元素
        applyDarkModeToSpecificElements();
    } else {
        // 移除深色模式样式
        styleElement.textContent = '';
        console.log('[BetterAliyunDoc] Dark mode disabled');

        // 恢复正文和有侧边栏所有元素的样式
        const contentDiv = document.querySelector('.aliyun-docs-view');
        if (contentDiv) {
            contentDiv.style.backgroundColor = ''; // 恢复背景色
            contentDiv.style.color = ''; // 恢复文字颜色
            const childElements = contentDiv.querySelectorAll('*'); // 获取所有子元素
            childElements.forEach(child => {
                child.style.backgroundColor = '';
                child.style.color = '';
            });
        }

        // 恢复左侧边栏样式
        const leftSidebar = document.querySelector('.aliyun-docs-menu');
        if (leftSidebar) {
            leftSidebar.style.backgroundColor = '';
            leftSidebar.style.color = '';
            const leftChildElements = leftSidebar.querySelectorAll('*');
            leftChildElements.forEach(child => {
                child.style.backgroundColor = '';
                child.style.color = '';
            });
        }

        // 恢复所有表格样式
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            table.style.backgroundColor = '';
            table.style.color = '';
            const tableChildElements = table.querySelectorAll('*');
            tableChildElements.forEach(child => {
                child.style.backgroundColor = '';
                child.style.color = '';
            });
        });

        // 恢复 type="note" 的 div 样式
        const noteDivs = document.querySelectorAll('div[type="note"]');
        noteDivs.forEach(div => {
            div.style.backgroundColor = '';
            div.style.color = '';
            const noteChildElements = div.querySelectorAll('*');
            noteChildElements.forEach(child => {
                child.style.backgroundColor = '';
                child.style.color = '';
            });
        });
    }
}

// 监视DOM变化以适应动态加载的搜索结果
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.className.startsWith('MenuSearch--resultContainer')) {
          node.style.backgroundColor = darkModeStyles.background;
          node.style.color = darkModeStyles.text;
        }
      });
    });
});

// 开始观察目标节点
const targetNode = document.body; // 观察整个文档
observer.observe(targetNode, { childList: true, subtree: true });

// 初始化时立即创建全局对象并绑定函数
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.darkMode = {
    toggleDarkMode: toggleDarkMode,
    styles: darkModeStyles
};

console.log('[BetterAliyunDoc] Dark mode module loaded');

// 如果已经处于深色模式，立即应用样式
if (window.__betterAliyunDoc && window.__betterAliyunDoc.isDarkMode) {
    toggleDarkMode();
}

// 移除自动启用深色模式的逻辑
console.log('[BetterAliyunDoc] Dark mode will not be applied on initialization');

// 将函数暴露到全局作用域
window.BetterAliyunDoc = window.BetterAliyunDoc || {};
window.BetterAliyunDoc.darkMode = {
    toggleDarkMode: toggleDarkMode,
    styles: darkModeStyles
};

// 设置深色模式观察器
function setupDarkModeObservers() {
    // 监听搜索结果
    const searchResultObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.classList && node.classList.contains('search-result-item')) {
                    applyDarkModeToSearchResults(node.parentElement);
                }
            });
        });
    });

    // 监听帮助文档内容
    const helpDocsObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.classList && node.classList.contains('icms-help-docs-content')) {
                    applyDarkModeToHelpDocsContent(node);
                }
            });
        });
    });

    // 开始观察
    const content = document.querySelector('.aliyun-docs-view');
    if (content) {
        searchResultObserver.observe(content, { childList: true, subtree: true });
        helpDocsObserver.observe(content, { childList: true, subtree: true });
    }
}

// 重置样式
function resetStyles() {
    document.body.style.removeProperty('background-color');
    
    const content = document.querySelector('.aliyun-docs-view');
    if (content) {
        content.style.removeProperty('background-color');
        content.style.removeProperty('color');

        // 重置表格样式
        const tables = content.querySelectorAll('table');
        tables.forEach(table => {
            table.style.removeProperty('border-color');
            table.querySelectorAll('th, td').forEach(cell => {
                cell.style.removeProperty('background-color');
                cell.style.removeProperty('color');
                cell.style.removeProperty('border-color');
            });
        });

        // 重置链接样式
        content.querySelectorAll('a').forEach(link => {
            link.style.removeProperty('color');
        });

        // 重置代码块样式
        content.querySelectorAll('pre, code').forEach(block => {
            block.style.removeProperty('background-color');
            block.style.removeProperty('color');
        });
    }
}
