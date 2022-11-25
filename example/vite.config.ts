import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.sqlite'],
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/sql.js-httpvfs/dist/sqlite.worker.js',
          dest: 'assets'
        },
        {
          src: 'node_modules/sql.js-httpvfs/dist/sql-wasm.wasm',
          dest: 'assets'
        },
        {
          src: 'src/assets/db.sqlite',
          dest: 'assets'
        }
      ]
    })
  ]
})
