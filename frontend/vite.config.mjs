import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = parseInt(env.PORT) || 3000;

  return {
    server: {

      open: true,
      port: PORT,
      host: true,
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: [
      ]
    },
    base: API_URL,
    plugins: [react(), jsconfigPaths()]
  };
});
