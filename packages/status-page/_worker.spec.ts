import { describe, expect, it, vi } from 'vitest'
import worker from './_worker'

const result = { name: 'John' }
const request = { url: 'https://test.de/api/statuspage/' } as Request
const request2 = { url: 'https://test.de/test.jpg' } as Request
const env = {
  KV_STATUS_PAGE: { get(_var1: unknown, _var2: unknown) { return result } },
  ASSETS: { fetch(request: Request) { return request.url } },
}

function ResponseMock(this: any, data: BodyInit, init: RequestInit) {
  this.data = data
  this.init = init
}

vi.stubGlobal('Response', ResponseMock)

describe('Page Worker Test', () => {
  it('get env data', async () => {
    const data = await worker.fetch(request, env)
    expect(data.data).equal(JSON.stringify(result))
  })

  it('get asset', async () => {
    const data = await worker.fetch(request2, env)
    expect(data).equal(request2.url)
  })
})
