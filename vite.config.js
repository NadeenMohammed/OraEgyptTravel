import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const { PORT } = loadEnv(mode, process.cwd(), 'PORT');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${PORT || '5000'}`,
          changeOrigin: true,
        },
      },
    },
  };
});
