import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { execSync } from 'child_process'
import { generateSitemap } from 'tanstack-router-sitemap'
import { sitemap } from './src/lib/sitemap'

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
const buildTime = new Date().toISOString()

const config = defineConfig({
  define: {
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash),
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime),
  },
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    generateSitemap(sitemap)
  ],
})

export default config
