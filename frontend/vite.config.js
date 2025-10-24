import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from root directory
  const env = loadEnv(mode, '../', '')
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.FRONTEND_PORT) || 3000,
    },
    define: {
      // Make environment variables available to the client
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME),
      'process.env.VITE_APP_VERSION': JSON.stringify(env.VITE_APP_VERSION),
      'process.env.VITE_ENABLE_ANALYTICS': JSON.stringify(env.VITE_ENABLE_ANALYTICS),
      'process.env.VITE_ENABLE_DEBUG': JSON.stringify(env.VITE_ENABLE_DEBUG),
    }
  }
})
