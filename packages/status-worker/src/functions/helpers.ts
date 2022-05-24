import config from './../../../../config.json'

declare const KV_STATUS_PAGE: KVNamespace

const kvDataKey = 'KV_STATUS_PAGE'

export interface WorkerMonitor { id?: string; name: any; description?: string; url: any; method: any; expectStatus?: number; followRedirect?: boolean; linkable?: boolean }

interface MonitorRes {[key: string]: { n: number, ms: number, a: number}}

interface MonitorChecks {[key: string]: {fails: number, res: MonitorRes}}

interface Monitor { firstCheck: string, lastCheck: { status?: number, statusText?: string, operational?: boolean}, checks: MonitorChecks}

interface Monitors { [key: string]: Monitor }

export interface WorkerMonitorState { lastUpdate: { allOperational: boolean, time?: number, loc?: string}, monitors: Monitors }

export async function getKVMonitors() {
  // trying both to see performance difference
  const data = KV_STATUS_PAGE.get(kvDataKey, 'json')
  //const data = JSON.parse(await KV_STATUS_PAGE.get(kvDataKey, 'text'))

  const defaultData: WorkerMonitorState = { lastUpdate: {allOperational: true}, monitors: {} }

  if (Object.keys(data).length === 0) {return data} else {return defaultData}
}

export async function setKVMonitors(data: WorkerMonitorState) {
  return KV_STATUS_PAGE.put(kvDataKey, JSON.stringify(data))
}

const getOperationalLabel = (operational: boolean) => {
  return operational
    ? config.settings.monitorLabelOperational
    : config.settings.monitorLabelNotOperational
}

export async function notifySlack(monitor: WorkerMonitor, operational: boolean) {
  const payload = {
    attachments: [
      {
        fallback: `Monitor ${monitor.name} changed status to ${getOperationalLabel(operational)}`,
        color: operational ? '#36a64f' : '#f2c744',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Monitor *${
                monitor.name
              }* changed status to *${getOperationalLabel(operational)}*`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `${operational ? ':white_check_mark:' : ':x:'} \`${
                  monitor.method ? monitor.method : 'GET'
                } ${monitor.url}\` - :eyes: <${
                  config.settings.url
                }|Status Page>`,
              },
            ],
          },
        ],
      },
    ],
  }
  return fetch(process.env.SECRET_SLACK_WEBHOOK_URL as string, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function notifyTelegram(monitor: WorkerMonitor, operational:boolean) {
  const text = `Monitor *${monitor.name.replaceAll(
    '-',
    '\\-',
  )}* changed status to *${getOperationalLabel(operational)}*
  ${operational ? '✅' : '❌'} \`${monitor.method ? monitor.method : 'GET'} ${
    monitor.url
  }\` \\- 👀 [Status Page](${config.settings.url})`

  const payload = new FormData()
  payload.append('chat_id', process.env.SECRET_TELEGRAM_CHAT_ID as string)
  payload.append('parse_mode', 'MarkdownV2')
  payload.append('text', text)

  const telegramUrl = `https://api.telegram.org/bot${process.env.SECRET_TELEGRAM_API_TOKEN}/sendMessage`
  return fetch(telegramUrl, {
    body: payload,
    method: 'POST',
  })
}

// Visualize your payload using https://leovoel.github.io/embed-visualizer/
export async function notifyDiscord(monitor: WorkerMonitor, operational: boolean) {
  const payload = {
    username: `${config.settings.title}`,
    avatar_url: `${config.settings.url}/${config.settings.logo}`,
    embeds: [
      {
        title: `${monitor.name} is ${getOperationalLabel(operational)} ${
          operational ? ':white_check_mark:' : ':x:'
        }`,
        description: `\`${monitor.method ? monitor.method : 'GET'} ${
          monitor.url
        }\` - :eyes: [Status Page](${config.settings.url})`,
        color: operational ? 3581519 : 13632027,
      },
    ],
  }
  return fetch(process.env.SECRET_DISCORD_WEBHOOK_URL as string, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function getCheckLocation() {
  return ""
  /* const res = await fetch('https://cloudflare-dns.com/dns-query', {
    method: 'OPTIONS',
  })

  const header = res.headers.get('cf-ray')
  if ( header ) {
    return header.split('-')[1]
  } else {
    return ""
  }
  */
}