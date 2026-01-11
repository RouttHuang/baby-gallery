// 本地开发服务器 - 用于模拟Vercel Serverless Functions
// 仅用于本地开发，生产环境使用Vercel的Serverless Functions

import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// 直接在server.js中实现API处理函数，避免导入问题

// 华为云Drive Kit API配置 - 使用正确的OpenAPI端点
const HUAWEI_API_BASE = 'https://openapi.cloud.huawei.com/drive/v1';
const HUAWEI_OAUTH_BASE = 'https://oauth-login.cloud.huawei.com/oauth2/v3/token';

/**
 * 获取华为云Drive Kit的访问令牌（使用客户端模式）
 * @returns {Promise<string>} 访问令牌
 */
async function getAccessToken() {
  try {
    // 从环境变量获取配置
    const clientId = process.env.HUAWEI_CLIENT_ID;
    const clientSecret = process.env.HUAWEI_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('Missing Huawei API credentials in environment variables');
    }

    const tokenResponse = await fetch(HUAWEI_OAUTH_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://www.huawei.com/auth/drive.file',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      throw new Error(`Failed to get access token: ${tokenResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

/**
 * 使用Drive Kit API搜索文件和文件夹
 * @param {string} accessToken - 访问令牌
 * @param {string} query - 搜索查询语句
 * @returns {Promise<Array>} 搜索结果
 */
async function searchFiles(accessToken, query) {
  try {
    console.log(`Searching files with query: ${query}`);
    console.log(`API Base URL: ${HUAWEI_API_BASE}`);
    
    // 先测试网络连接
    const testUrl = 'https://www.huawei.com';
    console.log(`Testing network connection to: ${testUrl}`);
    await fetch(testUrl, { method: 'HEAD' });
    console.log('Network connection test passed');
    
    const response = await fetch(`${HUAWEI_API_BASE}/files:search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        fields: 'files(id, name, mimeType, size, modifiedTime, parentId, downloadUrl)'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to search files: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`Search successful, found ${data.files?.length || 0} files`);
    return data.files || [];
  } catch (error) {
    console.error('Error searching files:', error);
    console.error('Error details:', error.cause || 'No cause available');
    throw new Error(`fetch failed: ${error.message}`);
  }
}

/**
 * 获取指定文件夹ID
 * @param {string} accessToken - 访问令牌
 * @param {string} folderName - 文件夹名称
 * @returns {Promise<string>} 文件夹ID
 */
async function getFolderId(accessToken, folderName = '宝宝照片') {
  try {
    // 使用搜索API查找指定名称的文件夹
    const query = `name = '${folderName}' and mimeType = 'application/vnd.huawei-cloud-drive.folder'`;
    const folders = await searchFiles(accessToken, query);
    
    if (folders.length === 0) {
      throw new Error(`Folder "${folderName}" not found`);
    }

    return folders[0].id;
  } catch (error) {
    console.error('Error getting folder ID:', error);
    throw error;
  }
}

/**
 * 获取文件夹中的所有图片
 * @param {string} accessToken - 访问令牌
 * @param {string} folderId - 文件夹ID
 * @returns {Promise<Array>} 图片列表
 */
async function getPhotosInFolder(accessToken, folderId) {
  try {
    // 使用搜索API查找文件夹下的所有图片
    const query = `parentId = '${folderId}' and mimeType startsWith 'image/'`;
    const photos = await searchFiles(accessToken, query);
    return photos;
  } catch (error) {
    console.error('Error getting photos:', error);
    throw error;
  }
}

/**
 * 获取文件的下载URL
 * @param {string} accessToken - 访问令牌
 * @param {string} fileId - 文件ID
 * @param {string} existingUrl - 已有的下载URL
 * @returns {Promise<string>} 下载URL
 */
async function getFileDownloadUrl(accessToken, fileId, existingUrl) {
  try {
    // 如果API已经返回了有效的下载URL，直接使用
    if (existingUrl) {
      return existingUrl;
    }
    // 否则生成带有访问令牌的URL
    return `${HUAWEI_API_BASE}/files/${fileId}/content?access_token=${accessToken}`;
  } catch (error) {
    console.error('Error getting file download URL:', error);
    throw error;
  }
}

// API端点 - 模拟Vercel Serverless Function
app.get('/api/photos', async (req, res) => {
  try {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log('Received request to /api/photos');
    
    // 1. 获取访问令牌
    console.log('Step 1: Getting access token');
    const accessToken = await getAccessToken();
    console.log('Access token obtained successfully');
    
    // 2. 获取相册文件夹ID
    const folderName = process.env.HUAWEI_ALBUM_NAME || '宝宝照片';
    console.log(`Step 2: Getting folder ID for folder: ${folderName}`);
    const folderId = await getFolderId(accessToken, folderName);
    console.log(`Folder ID obtained: ${folderId}`);
    
    // 3. 获取文件夹中的所有图片
    console.log(`Step 3: Getting photos in folder: ${folderId}`);
    const photos = await getPhotosInFolder(accessToken, folderId);
    console.log(`Found ${photos.length} photos`);
    
    // 4. 格式化图片数据并生成下载URLs
    console.log('Step 4: Generating download URLs');
    const photosWithUrls = await Promise.all(photos.map(async (photo) => {
      const downloadUrl = await getFileDownloadUrl(accessToken, photo.id, photo.downloadUrl);
      return {
        id: photo.id,
        url: downloadUrl,
        title: photo.name,
        mimeType: photo.mimeType,
        size: photo.size,
        modifiedTime: photo.modifiedTime,
      };
    }));

    console.log('Photos processed successfully, returning response');
    // 返回图片列表
    return res.status(200).json(photosWithUrls);
  } catch (error) {
    console.error('Error in photos API:', error);
    console.error('Error stack:', error.stack);
    
    // API调用失败时返回空数组，确保网站仍能正常运行
    console.log('Returning empty photos array due to API error');
    return res.status(200).json([]);
  }
});

// 处理所有其他请求，返回index.html - 使用app.use中间件
app.use((req, res, next) => {
  // 检查是否为API请求
  if (req.path.startsWith('/api/')) {
    return next();
  }
  // 其他请求返回index.html
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Local development server running on http://localhost:${PORT}`);
  console.log(`API endpoint available at http://localhost:${PORT}/api/photos`);
});
