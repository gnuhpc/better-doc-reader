# Better Doc Reader

A Chrome extension that enhances the reading experience of technical documentation by providing a clean, content-focused view.

## Author

gnuhpc

## Features

- Toggle between full page and content-only views
- Automatic detection of compatible pages
- Visual indicators for page compatibility
- Clean and modern reading experience

## Screenshots
Prev vs Enabled
![Prev](https://raw.githubusercontent.com/gnuhpc/better-doc-reader/main/store-assets/prev.jpg)
![Enabled](https://raw.githubusercontent.com/gnuhpc/better-doc-reader/main/store-assets/enable.jpg)

## Installation Method 1: From Chrome Web Store

1. Visit the Chrome Web Store
2. Search for "Better Doc Reader"
3. Click "Add to Chrome"

## Installation Method 2: Manual Installation

1. Download the latest release
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extension directory

## Usage

1. When visiting a compatible documentation page, the extension icon will show a red dot
2. Click the extension icon to toggle between full page and content-only views
3. The icon will turn green when in content-only mode

## Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/better-doc-reader.git

# Package the extension
./package.sh
```

## Privacy Policy

This extension does not collect or transmit any user data. It only modifies the page layout locally in your browser.

## License

MIT
