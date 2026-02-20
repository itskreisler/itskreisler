// @ts-check
import { defineConfig } from 'astro/config'
// import AstroPWA from '@vite-pwa/astro'
// import prefetch from '@astrojs/prefetch'
// import sitemap from '@astrojs/sitemap'
// import compress from 'astro-compress'
// import robotsTxt from 'astro-robots-txt'
// import webmanifest from 'astro-webmanifest'
import vercel from '@astrojs/vercel'
import node from '@astrojs/node'
import react from '@astrojs/react'

import tailwindcss from '@tailwindcss/vite'
import { PROD, NODE_ENV, VITE_NODE_ENV, DEV } from './src/helpers/env'

const allFilesAssets = import.meta.glob('./src/assets/**/*')
const allFilesPublic = import.meta.glob('./public/**/*')
// console.log([...Object.keys(allFilesAssets), ...Object.keys(allFilesPublic)])
console.log({ PROD, NODE_ENV, VITE_NODE_ENV, DEV })
// https://astro.build/config
export default defineConfig({
    vite: {
        server: {
            allowedHosts: true
        },
        plugins: [tailwindcss()],
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/js/[name].js',
                    assetFileNames: 'assets/css/[name].css'
                }
            }
        }
    },
    site: 'https://itskreisler.vercel.app/',
    adapter: PROD
        ? vercel({
            includeFiles: [
                ...Object.keys(allFilesAssets),
                ...Object.keys(allFilesPublic)
            ]
        })
        : node({ mode: 'standalone' }),
    integrations: [react()],
    build: {
        format: 'file'
    }
})
