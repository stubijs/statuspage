interface env {
  KV_STATUS_PAGE: {
    data: any
    get(string, { type: string })
    put(string, string)
    reset()
  }
}

interface Response {
  spy: {
    fetch: {
      calls
      called
      callCount
    }
  }
}
