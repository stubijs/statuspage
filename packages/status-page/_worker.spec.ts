import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import worker from './_worker'

const result = {name:"John"}
const request = { url: "https://test.de/api/statuspage/" } as Request
const request2 = { url: "https://test.de/test.jpg" } as Request
const env = { KV_STATUS_PAGE : { get: function(var1: unknown, var2: unknown){ return result}}, ASSETS: { fetch: function(request: Request){return request.url}}}
function ResponseMock(this: any, data: BodyInit, init: RequestInit){
    this.data = data
    this.init = init
 }
  
vi.stubGlobal('Response', ResponseMock)

describe('Page Worker Test', function() {

    it('get env data', async function () {
        const data = await worker.fetch(request, env)
        expect(data.data).equal(JSON.stringify(result))
    })

    it('get asset', async function () {
        const data = await worker.fetch(request2, env)
        expect(data).equal(request2.url)
    })   

})