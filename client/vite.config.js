import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const commonConfig = {
    plugins: [react()],
  };

  // Development-specific options
  if (command === 'serve') {
    return {
      ...commonConfig,
      server: {
        port: 5173, // Change to your preferred port
        open: true, // Open the app in the default browser
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate', // Disable caching
        },
        // Additional dev server options can be added here
      },
    };
  }

  // Production-specific options
  if (command === 'build') {
    return {
      ...commonConfig,
      build: {
        outDir: 'dist', // Output directory
        assetsDir: 'assets', // Directory for assets
        rollupOptions: {
          output: {
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash].[ext]',
          },
        },
      },
    };
  }

  // Default configuration
  return commonConfig;
  
})

