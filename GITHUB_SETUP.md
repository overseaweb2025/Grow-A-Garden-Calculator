# GitHub Issues 发布功能配置指南

## 🔧 环境变量配置

要使用 GitHub Issues 发布功能，请在项目根目录创建 `.env.local` 文件，并添加以下配置：

```env
# GitHub Issues 发布配置
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_OWNER=your_github_username_or_organization
GITHUB_REPO=your_repository_name
```

## 📝 详细配置步骤

### 1. 创建 GitHub Personal Access Token

1. 登录 GitHub
2. 进入 Settings → Developer settings → Personal access tokens → Tokens (classic)
3. 点击 "Generate new token (classic)"
4. 设置 Token 权限：
   - ✅ `public_repo` (如果仓库是公开的)
   - ✅ `repo` (如果仓库是私有的)
   - ✅ `write:discussion` (可选，用于后续功能)

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
# 示例配置
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=myusername
GITHUB_REPO=my-blog-repo
```

### 3. 配置说明

- **GITHUB_TOKEN**: 您的 GitHub Personal Access Token
- **GITHUB_OWNER**: GitHub 用户名或组织名
- **GITHUB_REPO**: 要发布 Issues 的仓库名

## 🚀 使用方法

1. 在博客编辑页面填写内容
2. 点击 **Publish** 按钮
3. 系统会自动将博客数据以 JSON 格式发布到 GitHub Issues
4. 发布成功后会显示 Issue 链接

## 📋 发布格式

系统会创建以下格式的 Issue：

- **标题**: `📝 [博客标题]`
- **内容**: 包含完整的 JSON 数据和发布信息
- **标签**: `blog-post` + 用户自定义标签

## 🔍 获取博客数据

您可以通过以下 API 端点获取已发布的博客：

```javascript
// 获取所有博客文章
GET /api/github

// 获取特定 Issue 的博客文章
GET /api/github?issue=123
```

## 🛠️ 故障排除

### 常见错误

1. **GitHub configuration is missing**
   - 检查 `.env.local` 文件是否存在
   - 确认环境变量名称正确

2. **GitHub API Error: 401**
   - Token 无效或已过期
   - 检查 Token 权限设置

3. **GitHub API Error: 404**
   - 仓库名称错误
   - 用户名/组织名错误
   - Token 没有访问该仓库的权限

## 🔒 安全注意事项

- ⚠️ 不要将 `.env.local` 文件提交到 Git
- 🔐 定期更新 Personal Access Token
- 🛡️ 使用最小权限原则设置 Token 权限

## 📞 技术支持

如遇问题，请检查：
1. 网络连接
2. GitHub 服务状态
3. Token 权限和有效期
4. 仓库访问权限 