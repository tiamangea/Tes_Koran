import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Tes_Koran/', // <-- Tambahkan baris ini (jangan lupa garis miring di awal dan akhir)
})