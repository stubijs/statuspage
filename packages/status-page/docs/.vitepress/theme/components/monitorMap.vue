<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { GeoGeometryObjects } from 'd3'
import { geoEquirectangular, geoPath, pointer, select } from 'd3'
import geojson from './../utils/ne_110m_admin_0_countries.json'
import config from './../../../../../../config.json'
import locations from './../../../../../locations/locations.json'

const props = defineProps({
  svgData: Object,
  svgOrgLon: Number,
  svgOrgLat: Number,
})

const data = ref()
const tooltip = ref()

const daysHistogram = [...Array(config.settings.daysInHistogram)].map((_, i) => i)
const finData = {}

daysHistogram.forEach((currentValue) => {
  const date = new Date()
  date.setDate(date.getDate() - currentValue)
  const dayIndex = date.toISOString().split('T')[0]
  if (props.svgData.checks[dayIndex] && Object.prototype.hasOwnProperty.call(props.svgData.checks[dayIndex], 'res') && Object.keys(props.svgData.checks[dayIndex].res).length > 0) {
    Object.keys(props.svgData.checks[dayIndex].res).forEach((key) => {
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

      if (finData[key].msMin > props.svgData.checks[dayIndex].res[key].msMin)
        finData[key].msMin = props.svgData.checks[dayIndex].res[key].msMin

      if (finData[key].msMax < props.svgData.checks[dayIndex].res[key].msMax)
        finData[key].msMax = props.svgData.checks[dayIndex].res[key].msMax

      finData[key].ms += props.svgData.checks[dayIndex].res[key].ms
      finData[key].n += props.svgData.checks[dayIndex].res[key].n

      finData[key].a = Math.round(finData[key].ms / finData[key].n)
    })
  }
})

onMounted(() => {
  // create a tooltip
  const Tooltip = select(tooltip.value)

  // Three function that change the tooltip when user hover / move / leave a cell
  function mouseover() {
    Tooltip.classed('opacity-0 ', false).classed('opacity-100 ', true)
  }

  function mousemove(event, d) {
    const coords = pointer(event)
    Tooltip
      .html(`<p class="font-bold mb-2">${d.city} (${d.region})</p>`
       + `<span class="font-bold">avg:</span> ${d.a}ms, `
       + `<span class="font-bold">min:</span>  ${d.msMin}ms, `
       + `<span class="font-bold">max:</span>  ${d.msMax}ms `
       + `<p><span class="font-bold">n:</span> ${d.n}</p>`)
      .style('left', `${event.layerX - 100}px`)
      .style('top', `${event.layerY + 10}px`)
  }

  function mouseleave() {
    Tooltip.classed('opacity-0 ', true).classed('opacity-100 ', false)
      .style('left', '0px')
      .style('top', '0px')
  }

  // create svg
  const svg = select(data.value)
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 0 1920 1080')

  const projection = geoEquirectangular()
  const path = geoPath().projection(projection)

  projection.fitSize([1920, 1080], geojson as GeoGeometryObjects) // adjust the projection to the features
  svg.append('path').attr('d', path(geojson as GeoGeometryObjects)).attr('fill', '#69b3a2').style('stroke', '#fff') // draw the features
  Object.keys(finData).forEach((key) => {
    svg.append('circle')
      .attr('r', 15)
      .style('fill', 'orange')
      .attr('stroke', 'orange')
      .attr('stroke-width', 3)
      .attr('fill-opacity', 0.4)
      .attr('transform', () => { return `translate(${projection([finData[key].lon, finData[key].lat])})` })
      .on('mouseover', mouseover)
      .on('mousemove', (event) => { mousemove(event, finData[key]) })
      .on('mouseleave', mouseleave)

    const link = { type: 'LineString', coordinates: [[finData[key].lon, finData[key].lat], [props.svgOrgLon, props.svgOrgLat]] } // Change these data to see ho the great circle reacts
    svg.append('path').attr('d', path(link)).style('fill', 'none').style('stroke', 'orange').style('stroke-width', 3)
  })
})
</script>

<template>
  <div ref="tooltip" class="modal-content">
    Test
  </div>
  <details>
    <summary class="flex items-center justify-center">
      <div class="pill leading-5 status-label-green">
        More details
      </div>
    </summary>
    <div class="mt-4 leading-normal text-md">
      <div ref="data" />
    </div>
  </details>
</template>