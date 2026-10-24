import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In development, forward the course's forms to the forms app (`npm run dev` in
// ~/__DEV/assesment-form, port 3000), the way vercel.json does in production.
const FORMS = '^/classes/experimental-tools-f26/(midterm|_next|api)'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      [FORMS]: { target: 'http://localhost:3000', ws: true },
    },
  },
})
