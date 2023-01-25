import config from './../../../config.json'

const kvDataKey = 'monitor-data-v1'

export interface WorkerMonitor { id?: string; name: string; description?: string; url: string; method: string; expectStatus?: number; followRedirect?: boolean; linkable?: boolean }

export type MonitorRes = Record<string, { n: number; ms: number; a: number; msMin: number; msMax: number }>

export type failData = Record<number, { loc: string }>

export type MonitorChecks = Record<string, { fails: number; res: MonitorRes; failData: failData }>

export interface Monitor { firstCheck: string; lastCheck: { status?: number; statusText?: string; operational?: boolean }; checks: MonitorChecks}

export type Monitors = Record<string, Monitor>

export interface WorkerMonitorState { lastUpdate: { allOperational: boolean; time?: number; loc?: string }; monitors: Monitors }

export async function getKVMonitors(env: env) {
  const data = await env.KV_STATUS_PAGE.get(kvDataKey, { type: 'json' })
  // const data = JSON.parse(await KV_STATUS_PAGE.get(kvDataKey, 'text'))
  const defaultData: WorkerMonitorState = { lastUpdate: { allOperational: true }, monitors: {} }

  if (data === null)
    return defaultData
  else return data as unknown as WorkerMonitorState
}

export const getOperationalLabel = (operational: boolean) => {
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
  await fetch(process.env.SECRET_SLACK_WEBHOOK_URL as string, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}
export async function notifyTelegram(monitor: WorkerMonitor, operational: boolean) {
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
  await fetch(telegramUrl, {
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
  await fetch(process.env.SECRET_DISCORD_WEBHOOK_URL as string, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function getCheckLocation() {
  const res = await fetch('https://cloudflare-dns.com/dns-query', {
    method: 'OPTIONS',
  })

  const header = res.headers.get('cf-ray')
  if (header)
    return header.split('-')[1]
  else
    return 'unknown'
}

export function getDate() {
  return new Date().toISOString().split('T')[0]
}

export function getCleanUpDate() {
  // delete dates older than config.settings.daysInHistogram
  const date = new Date()
  date.setDate(date.getDate() - config.settings.daysSavedForHistogram)
  return date.toISOString().split('T')[0]
}

function getConfig() {
  return config
}

export async function processCronTrigger(event: ScheduledEvent, env: env, config = getConfig()) {
  // Get Worker PoP and save it to monitorsStateMetadata
  const checkLocation = await getCheckLocation()
  const checkDay = getDate()
  const cleanUpDate = getCleanUpDate()

  // Get monitors state from KV
  const monitorsState: WorkerMonitorState = await getKVMonitors(env)

  // Reset default all monitors state to true
  monitorsState.lastUpdate.allOperational = true

  for (const monitor of config.monitors) {
    // Monitor: remove days from KV
    if (config.settings.daysSavedForHistogram && config.settings.daysSavedForHistogram > 0 && monitorsState.monitors[monitor.id]) {
      Object.keys(monitorsState.monitors[monitor.id].checks).forEach((checkDay) => {
        if (checkDay < cleanUpDate)
          delete monitorsState.monitors[monitor.id].checks[checkDay]
      })
    }

    // Monitor not active - go on
    if (!monitor.shouldAnalyze)
      continue

    // Create default monitor state if does not exist yet
    if (typeof monitorsState.monitors[monitor.id] === 'undefined') {
      monitorsState.monitors[monitor.id] = {
        firstCheck: checkDay,
        lastCheck: {},
        checks: {},
      }
    }

    // Fetch the monitors URL
    const init: RequestInit<RequestInitCfProperties> = {
      method: monitor.method || 'GET',
      redirect: monitor.followRedirect ? 'follow' : 'manual',
      headers: {
        'User-Agent': config.settings.user_agent || 'cf-worker-status-page',
      },
    }

    // Perform a check and measure time
    const requestStartTime = Date.now()
    let monitorOperational = false
    let monitorStatus = 0
    let monitorStatusText = 'error'

    // Attention: try catch and fetch catch instruction is to catch 502 etc. errors
    try {
      await fetch(monitor.url, init).then((response) => {
        monitorOperational = response.status === (monitor.expectStatus || 200)
        monitorStatus = response.status
        monitorStatusText = response.statusText
      }).catch((error) => {
      // eslint-disable-next-line no-console
        console.log('found error', error)
      })
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log('found error', e)
    }

    const requestTime = Math.round(Date.now() - requestStartTime)

    // Determine whether operational and status changed
    const monitorStatusChanged
      = monitorsState.monitors[monitor.id].lastCheck.operational
      !== monitorOperational

    // Save monitor's last check response status
    monitorsState.monitors[monitor.id].lastCheck = {
      status: monitorStatus,
      statusText: monitorStatusText,
      operational: monitorOperational,
    }

    // Send Slack message on monitor change
    if (
      monitorStatusChanged
      && typeof SECRET_SLACK_WEBHOOK_URL !== 'undefined'
    )
      event.waitUntil(notifySlack(monitor, monitorOperational))

    // Send Telegram message on monitor change
    if (
      monitorStatusChanged
      && typeof SECRET_TELEGRAM_API_TOKEN !== 'undefined'
      && typeof SECRET_TELEGRAM_CHAT_ID !== 'undefined'
    )
      event.waitUntil(notifyTelegram(monitor, monitorOperational))

    // Send Discord message on monitor change
    if (
      monitorStatusChanged
      && typeof SECRET_DISCORD_WEBHOOK_URL !== 'undefined'
    )
      event.waitUntil(notifyDiscord(monitor, monitorOperational))

    // make sure checkDay exists in checks in cases when needed
    if (
      (config.settings.collectResponseTimes || !monitorOperational)
      && !Object.prototype.hasOwnProperty.call(monitorsState.monitors[monitor.id].checks, checkDay)
    ) {
      monitorsState.monitors[monitor.id].checks[checkDay] = {
        fails: 0,
        res: {},
        failData: {},
      }
    }

    if (config.settings.collectResponseTimes && monitorOperational) {
      // make sure location exists in current checkDay
      if (
        !Object.prototype.hasOwnProperty.call(monitorsState.monitors[monitor.id].checks[checkDay].res, checkLocation)
      ) {
        monitorsState.monitors[monitor.id].checks[checkDay].res[
          checkLocation
        ] = {
          n: 0,
          ms: 0,
          a: 0,
          msMin: 10000000,
          msMax: 0,
        }
      }

      // check and save min ms
      if (monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].msMin > requestTime)
        monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].msMin = requestTime

      // check and save max ms
      if (monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].msMax < requestTime)
        monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].msMax = requestTime

      // increment number of checks and sum of ms
      const no = ++monitorsState.monitors[monitor.id].checks[checkDay].res[
        checkLocation
      ].n
      const ms = (monitorsState.monitors[monitor.id].checks[checkDay].res[
        checkLocation
      ].ms += requestTime)

      // save new average ms
      monitorsState.monitors[monitor.id].checks[checkDay].res[
        checkLocation
      ].a = Math.round(ms / no)
    }
    else if (!monitorOperational) {
      // Save allOperational to false
      monitorsState.lastUpdate.allOperational = false

      monitorsState.monitors[monitor.id].checks[checkDay].failData[
        Date.now()
      ] = { loc: checkLocation }

      // Increment failed checks on status change or first fail of the day (maybe call it .incidents instead?)
      if (monitorStatusChanged || monitorsState.monitors[monitor.id].checks[checkDay].fails === 0)
        monitorsState.monitors[monitor.id].checks[checkDay].fails++
    }
  }

  // Save last update information
  monitorsState.lastUpdate.time = Date.now()
  monitorsState.lastUpdate.loc = checkLocation

  const dataString = JSON.stringify(monitorsState)
  await env.KV_STATUS_PAGE.put('monitor-data-v1', dataString)
}
