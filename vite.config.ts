import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 建議改為您的儲存庫名稱，前後都要有斜線
  base: '/winter-fuji-hakone-2026-2.0/', 
  build: {
    outDir: 'dist',
  }
});
