# 华为云空间API配置指南

## 1. 功能说明

本项目实现了从华为云空间自动同步"宝宝相册"文件夹中的照片到网站首页。主要通过以下技术实现：

- **后端**：Vercel Serverless Functions (`/api/photos.js`)
- **前端**：React组件 (`src/components/Gallery.jsx`)
- **API**：华为云Drive Kit API

## 2. 华为云Cloud Foundation Kit配置步骤

### 2.1 注册华为开发者账号

1. 访问 [华为开发者联盟](https://developer.huawei.com/consumer/cn/)
2. 注册并登录账号
3. 完成实名认证

### 2.2 创建应用

1. 进入 [华为开发者控制台](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html)
2. 点击"我的项目" > "创建项目"
3. 项目创建成功后，点击"添加应用"
4. 选择"Web"平台
5. 填写应用信息，点击"确认"
6. 在应用详情页，找到并复制 `Client ID` 和 `Client Secret`

### 2.3 配置Cloud Foundation Kit

1. 在应用详情页，点击左侧菜单"API管理"
2. 搜索并启用"Cloud Foundation Kit" API
3. 在"权限管理"中，添加以下权限：
   - `drive.file.read`（读取文件）
   - `drive.folder.read`（读取文件夹）
4. 配置重定向URL：`https://your-domain.com`（用于获取授权码，客户端模式下可选）

### 2.4 客户端模式配置

本项目使用华为云API的**客户端模式**（client_credentials），无需用户授权，直接通过应用凭证获取访问令牌：

1. 确保应用已启用Cloud Foundation Kit API并配置正确的权限
2. 客户端模式会自动使用Client ID和Client Secret获取访问令牌
3. 无需构建授权URL和获取refresh_token
4. 系统会自动管理访问令牌的刷新
5. 客户端模式使用的scope为：`https://www.huawei.com/auth/drive.file`

### 2.5 获取"宝宝照片"文件夹ID

1. 首次部署后，系统会自动查找名为"宝宝照片"的文件夹
2. 如果需要指定其他文件夹，可以通过环境变量 `HUAWEI_ALBUM_NAME` 设置
3. 系统会自动使用搜索API查找指定名称的文件夹
4. 或者，你可以通过调用华为云API手动获取文件夹ID：
   ```bash
   curl -X POST https://openapi.cloud.huawei.com/drive/v1/files:search \
   -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"query": "name = \"宝宝照片\" and mimeType = \"application/vnd.huawei-cloud-drive.folder\"", "fields": "files(id, name)"}'
   ```

## 3. 环境变量配置

### 3.1 本地开发环境变量配置

在本地开发时，你需要创建一个 `.env` 文件来配置环境变量：

1. 在项目根目录创建 `.env` 文件：
   ```bash
   touch .env
   ```

2. 在 `.env` 文件中添加以下内容：
   ```
   # 华为云Drive Kit API配置
   HUAWEI_CLIENT_ID=your_huawei_client_id
   HUAWEI_CLIENT_SECRET=your_huawei_client_secret
   
   # 可选：指定要同步的相册名称，默认值为"宝宝照片"
   # HUAWEI_ALBUM_NAME=自定义相册名称
   ```

3. 将 `your_huawei_client_id` 和 `your_huawei_client_secret` 替换为你从华为开发者控制台获取的实际值

4. 如果你想使用自定义相册名称，可以取消 `HUAWEI_ALBUM_NAME` 行的注释并设置为你想要的名称

### 3.2 Vercel环境变量配置

在Vercel项目设置中添加以下环境变量：

| 环境变量名 | 描述 | 示例值 | 必填 |
| ---------- | ---- | ------ | ---- |
| `HUAWEI_CLIENT_ID` | 华为应用的Client ID | `1234567890abcdef` | 是 |
| `HUAWEI_CLIENT_SECRET` | 华为应用的Client Secret | `abcdef1234567890` | 是 |
| `HUAWEI_ALBUM_NAME` | 要同步的相册名称 | `宝宝照片` | 否 |

### 配置步骤

1. 登录 [Vercel控制台](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单"Settings" > "Environment Variables"
4. 点击"Add"按钮，逐个添加上述环境变量
5. 保存后，重新部署项目

## 4. 代码说明

### 4.1 后端API (`api/photos.js`)

主要功能：
- 获取华为云访问令牌（使用client_credentials模式）
- 获取根目录下的所有文件夹
- 查找指定名称的相册文件夹
- 获取文件夹中的所有图片文件
- 为每张图片生成带访问令牌的下载链接
- 返回格式化的图片列表

API端点说明：
- **获取访问令牌**：`POST https://oauth-login.cloud.huawei.com/oauth2/v3/token`
- **搜索文件/文件夹**：`POST https://openapi.cloud.huawei.com/drive/v1/files:search`
- **获取文件内容**：`GET https://openapi.cloud.huawei.com/drive/v1/files/{fileId}/content?access_token={token}`

### 4.2 前端组件 (`src/components/Gallery.jsx`)

主要功能：
- 从API获取图片列表
- 合并API图片和本地图片
- 显示加载状态、错误状态和空状态
- 支持图片预览、点赞和评论
- 本地图片上传功能

## 5. 部署与测试

### 5.1 本地开发

#### 5.1.1 安装依赖

首先安装项目依赖：

```bash
# 安装依赖
npm install
```

#### 5.1.2 配置环境变量

按照第3.1节的说明，在项目根目录创建 `.env` 文件并配置环境变量。

#### 5.1.3 启动开发服务器

启动Vite开发服务器：

```bash
# 启动开发服务器
npm run dev
```

开发服务器启动后，会在终端显示访问URL，通常是 `http://localhost:5173`。

#### 5.1.4 本地测试

1. **访问网站**：在浏览器中打开 `http://localhost:5173`，查看网站是否正常运行

2. **测试API调用**：
   - 直接访问 `http://localhost:5173/api/photos` 查看API返回的照片数据
   - 或者在浏览器开发者工具中查看网络请求，确认API调用是否成功

3. **验证相册同步**：
   - 确保华为云空间中有名为"宝宝照片"的文件夹（或你在环境变量中指定的文件夹）
   - 检查网站是否成功加载并显示该文件夹中的照片
   - 尝试上传本地照片，确认本地功能正常

4. **调试方法**：
   - 使用浏览器开发者工具查看控制台日志和网络请求
   - 在 `api/photos.js` 中添加 `console.log()` 语句输出调试信息
   - 检查终端中的开发服务器日志，查看API调用的详细信息

#### 5.1.5 本地构建测试

在本地构建生产版本，确保代码可以正常构建：

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

预览服务器启动后，访问显示的URL（通常是 `http://localhost:4173`）查看生产版本的网站。

### 5.2 Vercel部署

1. 确保代码已上传到GitHub仓库
2. 在Vercel控制台中导入GitHub仓库
3. 配置环境变量（见第3节）
4. 点击"Deploy"按钮
5. 部署成功后，访问生成的URL

## 6. 常见问题

### 6.1 图片加载失败

- 检查环境变量是否正确配置
- 确认华为云空间有"宝宝相册"文件夹
- 检查华为应用的权限配置
- 查看Vercel日志获取详细错误信息

### 6.2 访问令牌过期

- 系统会自动使用Refresh Token刷新访问令牌
- 如果Refresh Token过期，需要重新获取（见第2.4节）

### 6.3 文件夹找不到

- 确保华为云空间中存在指定名称的文件夹
- 检查环境变量 `HUAWEI_ALBUM_NAME` 是否正确
- 确保应用有读取文件夹的权限

## 7. 更新日志

- v1.0.0: 初始版本，实现华为云照片自动同步功能
- v1.0.1: 优化错误处理和用户体验
- v1.0.2: 支持自定义相册名称

## 8. 技术支持

如果遇到配置问题，可以：

1. 查看Vercel部署日志
2. 检查华为云开发者控制台的应用配置
3. 参考 [华为云Drive Kit文档](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/introduction-0000001050040115)
4. 联系华为开发者支持

---

**注意**：请妥善保管你的API密钥，不要将它们泄露到代码库中！