import { defineConfig } from 'vitepress'
// import { version } from '../../package.json'

const statusPageName = 'Status Page jstubenrauch'
const statusPageDescription = 'Statuspage with Cloudflare Worker and Pages, Vitepress, Vite and Vue'
const ogUrl = ''
const ogImage = ''


export default defineConfig({
  title: statusPageName,
  description: statusPageDescription,
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
    repo: 'stubijs/statuspage',
    //logo: '/logo.svg',
    sidebar: false,
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Suggest changes to this page',

    nav: [
    ],

  },
})