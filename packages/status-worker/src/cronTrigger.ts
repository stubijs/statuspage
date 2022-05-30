import config from './../../../config.json'

const kvDataKey = 'monitor-data-v1'

export interface WorkerMonitor { id?: string; name: any; description?: string; url: any; method: any; expectStatus?: number; followRedirect?: boolean; linkable?: boolean }

type MonitorRes = Record<string, { n: number; ms: number; a: number }>

type MonitorChecks = Record<string, { fails: number; res: MonitorRes }>

interface Monitor { firstCheck: string; lastCheck: { status?: number; statusText?: string; operational?: boolean }; checks: MonitorChecks}

type Monitors = Record<string, Monitor>

export interface WorkerMonitorState { lastUpdate: { allOperational: boolean; time?: number; loc?: string }; monitors: Monitors }

export async function getKVMonitors(env: unknown) {
  // trying both to see performance difference

  const data = await env.KV_STATUS_PAGE.get(kvDataKey, { type: 'json' })
  // const data = JSON.parse(await KV_STATUS_PAGE.get(kvDataKey, 'text'))
  const defaultData: WorkerMonitorState = { lastUpdate: { allOperational: true }, monitors: {} }

  if (data === null)
    return defaultData
  else return data as unknown as WorkerMonitorState
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
  return ''
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

function getDate() {
  return new Date().toISOString().split('T')[0]
}

export async function processCronTrigger(event: ScheduledEvent, env: unknown) {
  // Get Worker PoP and save it to monitorsStateMetadata
  const checkLocation = await getCheckLocation()
  const checkDay = getDate()

  // Get monitors state from KV
  const monitorsState: WorkerMonitorState = await getKVMonitors(env)

  // Reset default all monitors state to true
  monitorsState.lastUpdate.allOperational = true

  for (const monitor of config.monitors) {
    // Create default monitor state if does not exist yet
    if (typeof monitorsState.monitors[monitor.id] === 'undefined') {
      monitorsState.monitors[monitor.id] = {
        firstCheck: checkDay,
        lastCheck: {},
        checks: {},
      }
    }

    // Fetch the monitors URL
    const init = {
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

    await fetch(monitor.url, init).then((response) => {
      monitorOperational = response.status === (monitor.expectStatus || 200)
      monitorStatus = response.status
      monitorStatusText = response.statusText
    }).catch((/* error */) => {
      // console.log('found error', error)
    })

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
        }
      }

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
