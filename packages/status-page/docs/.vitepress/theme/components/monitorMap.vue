<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { GeoGeometryObjects } from 'd3'
import geojson from './../utils/ne_110m_admin_0_countries.json'
import { dataTable } from './../utils/data'

const props = defineProps({
  svgData: Object,
  svgOrgLon: Number,
  svgOrgLat: Number,
})

const data = ref()
const tooltip = ref()

const finData = dataTable(props.svgData)

const generateWorld = async () => {
  const { geoEquirectangular, geoPath, pointer, select } = await import('d3')
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
}

onMounted(generateWorld)
</script>

<template>
  <div ref="tooltip" class="modal-content">
    Test
  </div>
  <div class="mt-4 leading-normal text-md">
    <div ref="data" />
  </div>
</template>
