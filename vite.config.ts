import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The repo is named aguilera3ulalio-sys.github.io, so GitHub Pages serves the
// site from the root of that address and I do not need a base path.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
