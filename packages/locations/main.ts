import fetch from 'node-fetch'
import pkg from 'fs-extra'
const { writeJson } = pkg

interface dataCFResponse {
  iata: string
  lat: number
  lon: number
  cca2: string
  region: string
  city: string
}

interface locData {
  lat: number
  lon: number
  cca2: string
  region: string
  city: string
}

interface locDataFin {
  [key: string]: locData
}

// Fetch the cloudflare locations
const init = {
  method: 'GET',
  cache: 'no-store',
}

const monitorUrl = 'https://speed.cloudflare.com/locations'

const response = await fetch(monitorUrl, init)
const data = await response.json() as Array<dataCFResponse>

const finData: locDataFin = {}

data.forEach((obj) => {
  finData[obj.iata] = {
    lat: obj.lat,
    lon: obj.lon,
    cca2: obj.cca2,
    region: obj.region,
    city: obj.city,
  }
})

writeJson('./locations.json', finData, (err: unknown) => {
  if (err)

    return console.error(err)

  // eslint-disable-next-line no-console
  console.log('success!')
})

export {}
