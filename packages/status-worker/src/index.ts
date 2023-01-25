/**
 * Welcome to Cloudflare Workers! This is your first worker.
*
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { processCronTrigger } from './cronTrigger'

export default {

  async fetch(request: Request, env: env, ctx: ExecutionContext): Promise<Response> {
    ctx.waitUntil(undefined)
    return new Response('Statuspage Worker!')
  },

  async scheduled(event: ScheduledEvent, env: env, ctx: ExecutionContext) {
    ctx.waitUntil(triggerEvent(event, env))
  },
}

async function triggerEvent(event: ScheduledEvent, env: env) {
  // Write code for updating your API
  switch (event.cron) {
    // You can set up to three schedules maximum.
    case '*/10 * * * *':
      // Every ten minutes
      await processCronTrigger(event, env)
      break
    default:
      await processCronTrigger(event, env)
      break
  }
}
