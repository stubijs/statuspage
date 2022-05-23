/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { processCronTrigger } from './functions/cronTrigger'

export default {
  async fetch(request: Request): Promise<Response> {
    return new Response("Statuspage Worker!");
  },
};

addEventListener('scheduled', event => {
  event.waitUntil(triggerEvent(event));
});

async function triggerEvent(event: ScheduledEvent) {
  // Write code for updating your API
  switch (event.cron) {
    // You can set up to three schedules maximum.
    case '*/10 * * * *':
      // Every ten minutes
      await processCronTrigger(event);
      break;
  }
  console.log('cron processed');
}
