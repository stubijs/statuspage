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
    // Only 4 Icons
    ['link', { rel: 'icon', href: '/icon.svg', type: 'image/svg', sizes: 'any' }],
    ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ffc40d' }],
    ['meta', { name: 'msapplication-TileColor', content: '#ffc40d' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    // SEO
    ['meta', { name: 'author', content: 'Jan Stubenrauch' }],
    ['meta', { name: 'keywords', content: 'status page, vite, vitepress, github, vue, cloudflare worker, cloudflare pages' }],
    // Open Graph Tags
    ['meta', { property: 'og:title', content: statusPageName }],
    ['meta', { property: 'og:description', content: statusPageDescription }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:image', content: ogImage }],
    // twitter
    ['meta', { name: 'twitter:title', content: statusPageName }],
    ['meta', { name: 'twitter:description', content: statusPageDescription }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  themeConfig: {
    logo: '/icon.svg',
    sidebar: [],
    nav: [
      {
        text: 'Docs',
        activeMatch: '^/(setup|known-issues)/',
        items: [
          { text: 'Setup', link: '/setup/' },
          { text: 'Known Issus', link: '/known-issues/' },
        ],
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © since 2022 Jan Stubenrauch',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/stubijs/statuspage/' },
    ],
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
