import config from './../../../../../../config.json'
import _locations from './../../../../../locations/locations.json'

// fix: Typescript does set wrong type
const locations: locations = _locations

export function dataTable(svgData: Monitor) {
  const daysHistogram = [...Array(config.settings.daysInHistogram)].map((_, i) => i)
  const finData: svgData = {}

  daysHistogram.forEach((currentValue) => {
    const date = new Date()
    date.setDate(date.getDate() - currentValue)
    const dayIndex = date.toISOString().split('T')[0]
    if (svgData.checks[dayIndex] && Object.prototype.hasOwnProperty.call(svgData.checks[dayIndex], 'res') && Object.keys(svgData.checks[dayIndex].res).length > 0) {
      Object.keys(svgData.checks[dayIndex].res).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(finData, key)) {
          finData[key] = {
            msMin: 1000000,
            msMax: 0,
            ms: 0,
            n: 0,
            a: 0,
            lon: locations[key].lon,
            lat: locations[key].lat,
            city: locations[key].city,
            region: locations[key].region,
          }
        }

        if (finData[key].msMin > svgData.checks[dayIndex].res[key].msMin)
          finData[key].msMin = svgData.checks[dayIndex].res[key].msMin

        if (finData[key].msMax < svgData.checks[dayIndex].res[key].msMax)
          finData[key].msMax = svgData.checks[dayIndex].res[key].msMax

        finData[key].ms += svgData.checks[dayIndex].res[key].ms
        finData[key].n += svgData.checks[dayIndex].res[key].n

        finData[key].a = Math.round(finData[key].ms / finData[key].n)
      })
    }
  })

  return finData
}
