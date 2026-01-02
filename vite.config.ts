
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 將 base 改為絕對路徑，對應您的 Repo 名稱
  base: '/winter-fuji-hakone-2026-2.0/',
  build: {
    outDir: 'dist',
  }
});
