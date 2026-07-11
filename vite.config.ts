import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  build: {
    minify: false // 윈도우 환경 빌드 안정성을 위해 미니파이 비활성화
  },
  plugins: [
    react(),
    {
      name: 'members-api',
      apply: 'serve', // 오직 개발 서버(npm run dev) 환경에서만 활성화
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // 회원 데이터 가져오기 API (GET)
          if (req.url === '/api/members' && req.method === 'GET') {
            try {
              const filePath = path.resolve('src/data/members.json');
              const data = fs.readFileSync(filePath, 'utf-8');
              res.writeHead(200, { 
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store'
              });
              res.end(data);
            } catch (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: (error as Error).message }));
            }
          } 
          // 회원 데이터 영구 저장 API (POST)
          else if (req.url === '/api/members' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const members = JSON.parse(body);
                const filePath = path.resolve('src/data/members.json');
                fs.writeFileSync(filePath, JSON.stringify(members, null, 2), 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: (error as Error).message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})
