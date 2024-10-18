import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000, // Vous pouvez choisir un port de votre choix
  },
  build: {
    outDir: 'dist', // Répertoire de sortie pour le build
  },
})
