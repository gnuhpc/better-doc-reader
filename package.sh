#!/bin/bash

# Get version from manifest.json
version=$(grep '"version"' manifest.json | cut -d '"' -f 4)
zip_name="better-doc-v${version}.zip"

# 创建临时目录
temp_dir=$(mktemp -d)
echo "Created temporary directory: $temp_dir"

# 复制必要文件
cp -r manifest.json background.js content.js popup.html popup.js icons src "$temp_dir/"
cp README.md privacy_policy.md "$temp_dir/"

# 进入临时目录
cd "$temp_dir" || exit

# 清理MacOS特定文件
find . -name ".DS_Store" -delete

# 创建 ZIP 文件（使用绝对路径）
zip -r "/Users/gnuhpc/CascadeProjects/windsurf-project/BetterAliyunDoc/$zip_name" ./* -x "*.DS_Store"

# 返回原目录
cd - > /dev/null || exit

# 清理
rm -rf "$temp_dir"

echo "Package created: $zip_name"
ls -lh "/Users/gnuhpc/CascadeProjects/windsurf-project/BetterAliyunDoc/$zip_name"
