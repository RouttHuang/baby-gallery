import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 代理所有 /api 请求到本地Express服务器
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 开发模式下可以使用本地mock数据
        bypass: (req, res, options) => {
          // 只在开发环境下使用mock数据
          if (process.env.NODE_ENV === 'development') {
            // 对于 /api/photos 请求，返回空数组或mock数据
            if (req.url === '/api/photos') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify([]));
              return true;
            }
          }
          return null;
        }
      }
    }
  }
})