import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import KVDefault from './../../../../test/data/KV_default.json'
import { dataTable } from './data'

const defaultKeys = Object.keys(KVDefault.monitors)
const getFirstDateOfEntry = Object.keys(KVDefault.monitors[defaultKeys[0]].checks)
const date = new Date(Date.parse(getFirstDateOfEntry.pop() as string))

describe('purchasing flow', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('check output of data transformation -> exist', () => {
    // set hour within business hours
    vi.setSystemTime(date)

    const data = dataTable(KVDefault.monitors[defaultKeys[0]])

    // access Date.now() will result in the date set above
     expect(data).exist
  })

  it('check output of data transformation -> has key', () => {
    // set hour within business hours
    vi.setSystemTime(date)

    const data = dataTable(KVDefault.monitors[defaultKeys[0]])
    const dataKeys = Object.keys(data)

    // access Date.now() will result in the date set above
     expect(dataKeys.length).toBeGreaterThan(0)
  })

  it('check output of data transformation -> key has msMin not equal to 1000000', () => {
    // set hour within business hours
    vi.setSystemTime(date)

    const data = dataTable(KVDefault.monitors[defaultKeys[0]])
    const dataKeys = Object.keys(data)

    // access Date.now() will result in the date set above
     expect(data[dataKeys[0]].msMin).toBeLessThan(1000000)
  })

})
