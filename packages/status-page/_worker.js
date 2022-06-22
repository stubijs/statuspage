export default {
  /**
   * @param {Request} request
   * @param {{ KV_STATUS_PAGE: any; ASSETS: any; }} env
   */
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/statuspage/')) {
      // TODO: Add your custom /api/* logic here.
      const kvDataKey = 'monitor-data-v1'
      const data = await env.KV_STATUS_PAGE.get(kvDataKey, { type: 'json' })
      const init = {
        headers: {
          'User-Agent': 'cf-worker-status-page',
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
      return new Response(JSON.stringify(data), init)
    }
    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    return env.ASSETS.fetch(request)
  },
}
