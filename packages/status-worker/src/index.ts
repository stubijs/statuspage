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

/**
const testEvent: ScheduledEvent = {
  cron: '',
  scheduledTime: 0,
  noRetry: function (): void {
    throw new Error('Function not implemented.');
  },
  waitUntil: function (promise: Promise<any>): void {
    throw new Error('Function not implemented.');
  },
  type: '',
  eventPhase: 0,
  composed: false,
  bubbles: false,
  cancelable: false,
  defaultPrevented: false,
  returnValue: false,
  timeStamp: 0,
  isTrusted: false,
  cancelBubble: false,
  stopImmediatePropagation: function (): void {
    throw new Error('Function not implemented.');
  },
  preventDefault: function (): void {
    throw new Error('Function not implemented.');
  },
  stopPropagation: function (): void {
    throw new Error('Function not implemented.');
  },
  composedPath: function (): EventTarget<Record<string, Event>>[] {
    throw new Error('Function not implemented.');
  }
}

export default {
  
  async fetch(request: Request): Promise<Response> {

    processCronTrigger(testEvent)

    addEventListener('scheduled', event => {
      event.waitUntil(triggerEvent(event));
    });

    return new Response("Statuspage Worker!");
  },
};
*/

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
    default:
      await processCronTrigger(event);
      break;
  }
  console.log('cron processed');
}
