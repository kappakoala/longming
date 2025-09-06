#!/bin/bash

# 🚀 推送龙铭大师八字测算 MCP 服务到 GitHub

echo "🔮 准备推送龙铭大师八字测算 MCP 服务到 GitHub..."

# 检查是否提供了 GitHub 仓库 URL
if [ -z "$1" ]; then
    echo "❌ 错误：请提供 GitHub 仓库 URL"
    echo "用法: ./push-to-github.sh https://github.com/YOUR_USERNAME/bazi-fortune-mcp.git"
    exit 1
fi

REPO_URL="$1"
echo "📦 目标仓库: $REPO_URL"

# 检查 Git 状态
echo "🔍 检查 Git 状态..."
git status --porcelain
if [ $? -ne 0 ]; then
    echo "❌ Git 状态检查失败"
    exit 1
fi

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin "$REPO_URL"
if [ $? -ne 0 ]; then
    echo "⚠️  远程仓库可能已存在，尝试更新..."
    git remote set-url origin "$REPO_URL"
fi

# 验证远程仓库
echo "✅ 远程仓库配置:"
git remote -v

# 推送主分支
echo "📤 推送主分支到 GitHub..."
git push -u origin main
if [ $? -ne 0 ]; then
    echo "❌ 推送主分支失败"
    exit 1
fi

# 推送标签
echo "🏷️  推送版本标签..."
git push origin v1.0.0
if [ $? -ne 0 ]; then
    echo "❌ 推送标签失败"
    exit 1
fi

# 显示成功信息
echo ""
echo "🎉 推送成功！"
echo "📋 接下来请:"
echo "1. 访问 GitHub 仓库: ${REPO_URL%%.git}"
echo "2. 创建 Release: ${REPO_URL%%.git}/releases/new"
echo "3. 选择标签 v1.0.0 并填写发布说明"
echo ""
echo "🔮 龙铭大师八字测算 MCP 服务现已在 GitHub 上发布！"