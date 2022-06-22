declare interface WorkerMonitor { id?: string; name: string; description?: string; url: string; method: string; expectStatus?: number; followRedirect?: boolean; linkable?: boolean }

declare interface MonitorResItem { n: number; ms: number; a: number; msMin: number; msMax: number }
declare type MonitorRes = Record<string, MonitorResItem>

declare type failData = Record<number, { loc: string }>

declare type MonitorChecks = Record<string, { fails: number; res: MonitorRes; failData: failData }>

declare interface Monitor { firstCheck: string; lastCheck: { status?: number; statusText?: string; operational?: boolean }; checks: MonitorChecks}

declare type Monitors = Record<string, Monitor>

declare interface WorkerMonitorState { lastUpdate: { allOperational: boolean; time?: number; loc?: string }; monitors: Monitors }

declare interface configSettings {
  title: string
  url: string
  logo: string
  daysInHistogram: number
  daysSavedForHistogram: number
  collectResponseTimes: boolean
  user_agent: string
  allmonitorsOperational: string
  notAllmonitorsOperational: string
  monitorLabelOperational: string
  monitorLabelPartOperational: string
  monitorLabelNotOperational: string
  monitorLabelNoData: string
  dayInHistogramNoData: string
  dayInHistogramOperational: string
  dayInHistogramNotOperational: string
}

declare interface configMonitor {
  id: string
  name: string
  description: string
  url: string
  method: string
  expectStatus: number
  followRedirect: boolean
  linkable: boolean
  lon: number
  lat: number
  shouldAnalyze: boolean
}

declare interface locationOne {
  lat: number
  lon: number
  cca2: string
  region: string
  city: string
}

declare type locations = Record<string, locationOne>

declare interface svgDataOne {
  msMin: number
  msMax: number
  ms: number
  n: number
  a: number
  lon: number
  lat: number
  city: string
  region: string
}

declare type svgData = Record<string, svgDataOne>
