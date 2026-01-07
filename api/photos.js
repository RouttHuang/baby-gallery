// api/photos.js - Vercel Serverless Function to fetch photos from Huawei Cloud Drive

// 华为云Drive Kit API配置
const HUAWEI_API_BASE = 'https://openapi.cloud.huawei.com/drive/v1';

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

    const tokenResponse = await fetch('https://oauth-login.cloud.huawei.com/oauth2/v3/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

/**
 * 获取指定文件夹ID
 * @param {string} accessToken - 访问令牌
 * @param {string} folderName - 文件夹名称
 * @returns {Promise<string>} 文件夹ID
 */
async function getFolderId(accessToken, folderName = '宝宝相册') {
  try {
    // 搜索指定名称的文件夹
    const response = await fetch(`${HUAWEI_API_BASE}/files:search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `name = '${folderName}' and mimeType = 'application/vnd.huawei-cloud-drive.folder'`,
        fields: 'files(fileId, name, mimeType, parentFolderId)'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to search folder: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // 查找指定名称的文件夹
    const folder = data.files?.[0];

    if (!folder) {
      throw new Error(`Folder "${folderName}" not found`);
    }

    return folder.fileId;
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
    // 获取文件夹下的所有文件
    const response = await fetch(`${HUAWEI_API_BASE}/files:search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `parentFolderId = '${folderId}' and mimeType startsWith 'image/'`,
        fields: 'files(fileId, name, mimeType, size, modifiedTime, downloadUrl)'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to list files: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error getting photos:', error);
    throw error;
  }
}

/**
 * Vercel Serverless Function 入口
 * @param {Request} req - 请求对象
 * @param {Response} res - 响应对象
 */
export default async function handler(req, res) {
  try {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 1. 获取访问令牌
    const accessToken = await getAccessToken();
    
    // 2. 获取"宝宝相册"文件夹ID
    const folderName = process.env.HUAWEI_ALBUM_NAME || '宝宝相册';
    const folderId = await getFolderId(accessToken, folderName);
    
    // 3. 获取文件夹中的所有图片
    const photos = await getPhotosInFolder(accessToken, folderId);
    
    // 4. 格式化图片数据
    const photosWithUrls = photos.map(photo => ({
      id: photo.fileId,
      url: photo.downloadUrl || `https://openapi.cloud.huawei.com/drive/v1/files/${photo.fileId}/content?access_token=${accessToken}`,
      title: photo.name,
      mimeType: photo.mimeType,
      size: photo.size,
      modifiedTime: photo.modifiedTime,
    }));

    // 返回图片列表
    return res.status(200).json(photosWithUrls);
  } catch (error) {
    console.error('Error in photos API:', error);
    return res.status(500).json({
      error: 'Failed to fetch photos from Huawei Cloud Drive',
      details: error.message,
      stack: error.stack
    });
  }
}