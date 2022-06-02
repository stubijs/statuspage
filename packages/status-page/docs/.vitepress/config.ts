import { defineConfig } from 'vitepress'
import Components from 'unplugin-vue-components/vite'
// import { version } from '../../package.json'

const statusPageName = 'Status Page'
const statusPageDescription = 'Statuspage with Cloudflare Worker and Pages, Vitepress, Vite and Vue'
const ogUrl = ''
const ogImage = ''

export default defineConfig({
  title: statusPageName,
  description: statusPageDescription,
  outDir: './../dist',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['meta', { name: 'author', content: 'Jan Stubenrauch' }],
    ['meta', { name: 'keywords', content: 'status page, vite, vitepress, github, vue, cloudflare worker, cloudflare pages' }],
    ['meta', { property: 'og:title', content: statusPageName }],
    ['meta', { property: 'og:description', content: statusPageDescription }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { name: 'twitter:title', content: statusPageName }],
    ['meta', { name: 'twitter:description', content: statusPageDescription }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // ['link', { href: font, rel: 'stylesheet' }],
    ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
  ],
  themeConfig: {
    // logo: '/logo.svg',
    sidebar: [],
    nav: [
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © since 2022 Jan Stubenrauch',
    },
  },
  vite: {
    plugins: [
      Components({
        // relative paths to the directory to search for components.
        dirs: ['.vitepress/theme/components'],
        // valid file extensions for components.
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        // search for subdirectories
        deep: true,
      }),
    ],
  },
})
