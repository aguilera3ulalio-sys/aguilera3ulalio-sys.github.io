import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site from /eulalio.com/ (the repo name), so the built
// files need that prefix. In local development I keep everything at the root.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/eulalio.com/' : '/',
}))
