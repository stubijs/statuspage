/*
 * Changes in this file needs the following commands to run perfectly inside dev environment
 * npm run clean
 * npm run dev
 * in Chrome Developer Tools -> Hard Reload
 */

/* cspell:words gradientbg */

module.exports = {
  darkMode: 'class',
  content: [
    './docs/.vitepress/**/*.js',
    './docs/.vitepress/**/*.vue',
    './docs/.vitepress/**/*.ts',
    './docs/**/*.md',
  ],
  safelist: ['html', 'body', 'VPPage'],
}
