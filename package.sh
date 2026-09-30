#!/bin/bash

# 获取当前脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 创建临时目录
temp_dir=$(mktemp -d)
echo "Created temporary directory: $temp_dir"

# 复制必要文件
cp -r manifest.json background.js content.js popup.html popup.js icons src "$temp_dir/"
cp README.md privacy_policy.md "$temp_dir/"

# 进入临时目录
cd "$temp_dir"

# 创建 ZIP 文件（保存在当前项目根目录下）
zip -r "$SCRIPT_DIR/better-doc.zip" ./*

# 返回原目录
cd - > /dev/null

# 清理
rm -rf "$temp_dir"

echo "Package created: $SCRIPT_DIR/better-doc.zip"
ls -lh "$SCRIPT_DIR/better-doc.zip"
