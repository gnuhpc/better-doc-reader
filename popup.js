// Group notes by URL
function groupNotesByUrl(notes) {
  const groups = {};
  notes.forEach((note) => {
    if (!groups[note.url]) {
      groups[note.url] = {
        title: note.title || '未知文档',
        url: note.url,
        notes: []
      };
    }
    groups[note.url].notes.push(note);
  });
  return groups;
}

async function exportNotes() {
  try {
    const result = await chrome.storage.sync.get('betterDocNotes');
    const notes = result.betterDocNotes || [];

    if (notes.length === 0) {
      window.alert('暂无笔记');
      return;
    }

    // Group notes by URL
    const groupedNotes = groupNotesByUrl(notes);

    // Generate markdown content
    let markdown = '# 阿里云文档笔记\n\n';

    Object.values(groupedNotes).forEach((group) => {
      markdown += `## ${group.title}\n\n`;
      group.notes.forEach((note) => {
        const date = new Date(note.timestamp).toLocaleDateString();
        markdown += `> ${note.text}\n\n`;
        markdown += `📅 ${date}\n\n`;
      });
    });

    // Create and trigger download
    const blob = new window.Blob([markdown], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '阿里云文档笔记.md';
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting notes:', error);
    window.alert('导出失败');
  }
}

function toggleNoteGroup(groupDiv, isExpanded = false) {
  const noteItems = groupDiv.querySelector('.note-items');
  const toggleIcon = groupDiv.querySelector('.toggle-icon');

  if (isExpanded) {
    noteItems.classList.remove('collapsed');
    toggleIcon.classList.remove('collapsed');
  } else {
    noteItems.classList.add('collapsed');
    toggleIcon.classList.add('collapsed');
  }
}

// Load and display notes in popup
document.addEventListener('DOMContentLoaded', async () => {
  const notesList = document.getElementById('notes-list');
  const emptyNotes = document.getElementById('empty-notes');
  const exportButton = document.getElementById('export-notes');

  // Get current tab URL
  const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentUrl = currentTab.url.replace(/[?#].*$/, '').replace(/\/$/, '');

  // Add export button click handler
  exportButton.addEventListener('click', exportNotes);

  try {
    const result = await chrome.storage.sync.get('betterDocNotes');
    const notes = result.betterDocNotes || [];

    if (notes.length === 0) {
      emptyNotes.style.display = 'block';
      notesList.style.display = 'none';
      return;
    }

    emptyNotes.style.display = 'none';
    notesList.style.display = 'block';

    // Sort notes by timestamp, newest first
    notes.sort((a, b) => b.timestamp - a.timestamp);

    // Group notes by URL
    const groupedNotes = groupNotesByUrl(notes);

    // Sort groups to put current page first
    const sortedGroups = Object.entries(groupedNotes).sort(([urlA], [urlB]) => {
      if (urlA === currentUrl) return -1;
      if (urlB === currentUrl) return 1;
      return 0;
    });

    // Clear existing notes
    notesList.innerHTML = '';

    // Display grouped notes
    sortedGroups.forEach(([url, group]) => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'note-group';
      if (url === currentUrl) {
        groupDiv.classList.add('current');
      }

      // Create header with title and toggle
      const docTitleDiv = document.createElement('div');
      docTitleDiv.className = 'doc-title';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'title-text';
      titleSpan.textContent = group.title;

      const toggleIcon = document.createElement('span');
      toggleIcon.className = 'toggle-icon';
      toggleIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';

      if (url === currentUrl) {
        const currentLabel = document.createElement('span');
        currentLabel.className = 'current-page-label';
        currentLabel.textContent = '当前页面';
        titleSpan.appendChild(currentLabel);
      }

      docTitleDiv.appendChild(titleSpan);
      docTitleDiv.appendChild(toggleIcon);

      const notesContainer = document.createElement('div');
      notesContainer.className = 'note-items';

      group.notes.forEach((note) => {
        const li = document.createElement('li');
        li.className = 'note-item';

        // Create delete button
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-note';
        deleteBtn.textContent = '×';
        deleteBtn.title = '删除笔记';
        deleteBtn.addEventListener('click', async () => {
          try {
            const notes = (await chrome.storage.sync.get('betterDocNotes')).betterDocNotes || [];
            const updatedNotes = notes.filter((n) => n.id !== note.id);
            await chrome.storage.sync.set({ 'betterDocNotes': updatedNotes });

            // Send message to content script to remove highlight
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (tabs[0]) {
              await chrome.tabs.sendMessage(tabs[0].id, {
                command: 'remove-highlight',
                noteId: note.id
              });
            }

            li.remove();

            // If this was the last note in the group, remove the group
            if (notesContainer.querySelectorAll('.note-item').length === 0) {
              groupDiv.remove();
            }

            // Show empty state if no notes left
            if (updatedNotes.length === 0) {
              emptyNotes.style.display = 'block';
              notesList.style.display = 'none';
            }
          } catch (error) {
            console.error('Error deleting note:', error);
          }
        });

        const text = document.createElement('div');
        text.className = 'note-text';
        text.textContent = note.text;

        li.appendChild(deleteBtn);
        li.appendChild(text);
        notesContainer.appendChild(li);
      });

      groupDiv.appendChild(docTitleDiv);
      groupDiv.appendChild(notesContainer);
      notesList.appendChild(groupDiv);

      // Set up toggle behavior
      docTitleDiv.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-note')) {
          toggleNoteGroup(groupDiv, notesContainer.classList.contains('collapsed'));
        }
      });

      // Initialize state: expand current page, collapse others
      toggleNoteGroup(groupDiv, url === currentUrl);
    });
  } catch (error) {
    console.error('Error loading notes:', error);
    emptyNotes.textContent = '加载笔记时出错';
    emptyNotes.style.display = 'block';
    notesList.style.display = 'none';
  }
});
