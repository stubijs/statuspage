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

const testEvent: ScheduledEvent = {
  cron: '',
  scheduledTime: 0,
  noRetry(): void {
    throw new Error('Function not implemented.')
  },
  waitUntil(): void {
    throw new Error('Function not implemented.')
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
  stopImmediatePropagation(): void {
    throw new Error('Function not implemented.')
  },
  preventDefault(): void {
    throw new Error('Function not implemented.')
  },
  stopPropagation(): void {
    throw new Error('Function not implemented.')
  },
  composedPath(): EventTarget<Record<string, Event>>[] {
    throw new Error('Function not implemented.')
  },
}

export default {

  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    ctx.waitUntil(triggerEvent(testEvent, env))
    return new Response('Statuspage Worker!')
  },
  async scheduled(event: ScheduledEvent, env: unknown, ctx: ExecutionContext) {
    ctx.waitUntil(triggerEvent(event, env))
  },
}

async function triggerEvent(event: ScheduledEvent, env: unknown) {
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
