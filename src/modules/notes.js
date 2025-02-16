// Notes module for BetterAliyunDoc
window.BetterAliyunDoc = window.BetterAliyunDoc || {};

window.BetterAliyunDoc.notes = {
  init() {
    // Only initialize in top-level window
    if (window !== window.top) {
      return;
    }

    console.debug('[BetterAliyunDoc] Notes module init starting...');
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.debug('[BetterAliyunDoc] DOM ready, setting up notes module...');
        this._initFeatures();
      });
    } else {
      this._initFeatures();
    }
  },

  _initFeatures() {
    try {
      this.injectStyles();
      this.setupSelectionListener();
      console.debug('[BetterAliyunDoc] Notes module features initialized');
    } catch (error) {
      console.error('[BetterAliyunDoc] Initialization error:', error);
    }
  },

  injectStyles() {
    const styles = `
      .better-doc-save-note-btn {
        position: fixed;
        background: #1890ff;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        z-index: 2147483647;
        display: none;
      }

      .better-doc-save-note-btn:hover {
        background: #40a9ff;
      }

      @keyframes better-doc-fade {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .better-doc-toast {
        position: fixed;
        bottom: 70px;
        right: 20px;
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        border-radius: 4px;
        font-size: 14px;
        z-index: 2147483647;
        animation: better-doc-fade 0.3s ease;
      }
    `;

    if (!document.querySelector('#better-doc-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'better-doc-styles';
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
      console.debug('[BetterAliyunDoc] Styles injected');
    }
  },

  cleanUrl(url) {
    return url.replace(/[?#].*$/, '').replace(/\/$/, '');
  },

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'better-doc-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3000);
  },

  setupSelectionListener() {
    let currentSelection = {
      text: '',
      rect: null
    };

    document.addEventListener('mouseup', (event) => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (!selectedText || event.target.classList.contains('better-doc-save-note-btn')) {
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        currentSelection = {
          text: selectedText,
          rect: rect
        };
        this.showSaveNoteButton(rect);
      } catch (error) {
        console.error('[BetterAliyunDoc] Selection error:', error);
      }
    });

    document.addEventListener('mousedown', (event) => {
      if (!event.target.classList.contains('better-doc-save-note-btn')) {
        this.removeSaveNoteButton();
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('better-doc-save-note-btn')) {
        event.preventDefault();
        event.stopPropagation();
        if (currentSelection.text) {
          this.saveNote({
            id: Date.now().toString(),
            text: currentSelection.text,
            url: this.cleanUrl(window.location.href),
            title: document.title,
            timestamp: Date.now()
          });
          this.showToast('笔记已保存');
        }
        this.removeSaveNoteButton();
      }
    });
  },

  showSaveNoteButton(rect) {
    this.removeSaveNoteButton();
    const button = document.createElement('div');
    button.className = 'better-doc-save-note-btn';
    button.textContent = '保存笔记';
    button.style.top = `${rect.top - 30}px`;
    button.style.left = `${rect.left}px`;
    document.body.appendChild(button);
    button.style.display = 'block';
  },

  removeSaveNoteButton() {
    const existingButton = document.querySelector('.better-doc-save-note-btn');
    if (existingButton) {
      existingButton.remove();
    }
  },

  async saveNote(noteData) {
    try {
      const notes = await this.getNotes();
      notes.push(noteData);
      await chrome.storage.sync.set({ 'betterDocNotes': notes });
      console.debug('[BetterAliyunDoc] Note saved:', noteData.text.substring(0, 50) + '...');
    } catch (error) {
      console.error('[BetterAliyunDoc] Error saving note:', error);
    }
  },

  async getNotes() {
    try {
      const result = await chrome.storage.sync.get('betterDocNotes');
      return result.betterDocNotes || [];
    } catch (error) {
      console.error('[BetterAliyunDoc] Error getting notes:', error);
      return [];
    }
  }
};

// Initialize notes module
window.BetterAliyunDoc.notes.init();
