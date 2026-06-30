/**
 * Vite 构建配置 - 集成 @dcloudio/vite-plugin-uni
 * 约束：路径别名 @ 指向 packages/mp 根，与 tsconfig paths 同步
 */
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 5173,
  },
});
