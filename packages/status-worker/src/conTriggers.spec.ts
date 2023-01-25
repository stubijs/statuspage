import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getCheckLocation, getCleanUpDate, getDate, getKVMonitors, getOperationalLabel, processCronTrigger } from './cronTrigger'
import KVData from './../../../test/data/KV_default.json'
import config from './../../../config.json'
import config_1 from './../../../test/data/config_1.json'

const env1 = {
  KV_STATUS_PAGE: {
    get(_var1: unknown, _var2: unknown) {
      return null
    },
  },
}
const env2 = {
  KV_STATUS_PAGE: {
    get(_var1: unknown, _var2: unknown) {
      return KVData
    },
  },
}

describe('getKVMonitors', () => {
  it('KV does not exist', async () => {
    const data = await getKVMonitors(env1 as env)
    const defaultValue = { lastUpdate: { allOperational: true }, monitors: {} }
    expect(data).toEqual(defaultValue)
  })

  it('KV exist', async () => {
    const data = await getKVMonitors(env2 as env)
    expect(data).toEqual(KVData)
  })
})

describe('getOperationalLabel', () => {
  it('true', async () => {
    expect(getOperationalLabel(true)).toEqual(config.settings.monitorLabelOperational)
  })

  it('false', async () => {
    expect(getOperationalLabel(false)).toEqual(config.settings.monitorLabelNotOperational)
  })
})

describe('getCheckLocation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('location found', async () => {
    const fetchMockCfRay = vi.fn(() =>
      Promise.resolve({
        headers: {
          'cf-ray': 'data-test',
          'get': () => {
            return 'data-test'
          },
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMockCfRay)
    expect(await getCheckLocation()).toEqual('test')
  })

  it('location not found', async () => {
    const fetchMockCfRayNot = vi.fn(() =>
      Promise.resolve({
        headers: {
          get: () => {
            return undefined
          },
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMockCfRayNot)
    expect(await getCheckLocation()).toEqual('unknown')
  })
})

describe('getDate', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('test regex', async () => {
    const date = new Date(Date.UTC(2000, 1, 1))
    vi.setSystemTime(date)
    // match yyyy-mm-dd
    expect(getDate()).toMatch(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  })
})

describe('getCleanUpDate', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('test regex', async () => {
    const date = new Date(Date.UTC(2000, 1, 1))
    vi.setSystemTime(date)
    // match yyyy-mm-dd
    expect(getCleanUpDate()).toMatch(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  })
})

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

const KVDemoData = { lastUpdate: { allOperational: true }, monitors: {} }
const env: env = {
  KV_STATUS_PAGE: {
    data: {},
    get(_var1: unknown, _var2: unknown) { return this.data },
    put(_var1: unknown, var2: string | object) { this.data = var2 },
    reset() {
      // Do not use a const here!!!
      this.data = { lastUpdate: { allOperational: true }, monitors: {} }
    },
  },
}

describe('processCronTrigger', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('fetch does not work', async () => {
    env.KV_STATUS_PAGE.reset()
    await processCronTrigger(testEvent, env)
    expect(JSON.stringify(env.KV_STATUS_PAGE.data)).not.toBe(JSON.stringify(KVDemoData))
  })

  it('fetch mock', async () => {
    const timeNow = Date.now()

    const fetchMock = vi.fn(() =>
      Promise.resolve({
        headers: {
          get: () => {
            return undefined
          },
        },
        status: 200,
        statusText: 'OK',
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    env.KV_STATUS_PAGE.reset()
    await processCronTrigger(testEvent, env)
    const FinData = JSON.parse(env.KV_STATUS_PAGE.data)
    expect(Object.keys(FinData.monitors).length).toBeGreaterThan(0)
    expect(FinData.lastUpdate.loc).toBe('unknown')
    expect(FinData.lastUpdate.allOperational).toBe(true)
    expect(FinData.lastUpdate.time).toBeGreaterThanOrEqual(timeNow)
  })

  it('fetch mock + check shouldAnalyze', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        headers: {
          get: () => {
            return undefined
          },
        },
        status: 200,
        statusText: 'OK',
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    env.KV_STATUS_PAGE.reset()
    await processCronTrigger(testEvent, env, config_1)
    const FinData = JSON.parse(env.KV_STATUS_PAGE.data)
    expect(Object.keys(FinData.monitors).length).toBeGreaterThan(0)
    expect(Object.keys(FinData.monitors).includes('test2')).toBe(false)
  })

  it('fetch mock + check shouldAnalyze', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        headers: {
          get: () => {
            return undefined
          },
        },
        status: 200,
        statusText: 'OK',
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    env.KV_STATUS_PAGE.reset()
    await processCronTrigger(testEvent, env, config_1)
    const FinData = JSON.parse(env.KV_STATUS_PAGE.data)
    expect(Object.keys(FinData.monitors).length).toBeGreaterThan(0)
    expect(Object.keys(FinData.monitors).includes('test2')).toBe(false)
  })
})
