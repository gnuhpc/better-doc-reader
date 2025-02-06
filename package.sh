#!/bin/bash

# 创建临时目录
temp_dir=$(mktemp -d)
echo "Created temporary directory: $temp_dir"

# 复制必要文件
cp -r manifest.json background.js content.js icons "$temp_dir/"
cp README.md privacy_policy.md "$temp_dir/"

# 进入临时目录
cd "$temp_dir"

# 创建 ZIP 文件（使用绝对路径）
zip -r /Users/gnuhpc/CascadeProjects/windsurf-project/BetterAliyunDoc/better-doc.zip ./*

# 返回原目录
cd - > /dev/null

# 清理
rm -rf "$temp_dir"

echo "Package created: better-doc.zip"
ls -lh /Users/gnuhpc/CascadeProjects/windsurf-project/BetterAliyunDoc/better-doc.zip
