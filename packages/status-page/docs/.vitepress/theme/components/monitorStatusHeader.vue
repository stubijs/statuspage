<script setup lang="ts">
import { computed } from 'vue'
import _locations from './../../../../../locations/locations.json'

interface monitorStatusHeader {
  cfKvStatus: boolean
  cfKvNumber: number
  cfKvLoc: string
}

const props = withDefaults(defineProps<monitorStatusHeader>(), {
  cfKvStatus: false,
  cfKvLoc: 'unknown',
})

// fix: Typescript does set wrong type
const locations: locations = _locations

const time = computed(() => {
  return Math.round((Date.now() - props.cfKvNumber) / 1000)
})
const location = computed(() => {
  return locations[props.cfKvLoc].city || 'unknown'
})
</script>

<template>
  <div class="card p-4 mb-6 font-semibold" :class="[props.cfKvStatus ? 'status-header-green' : 'status-header-yellow']">
    <div class="flex  flex-col md:flex-row justify-between items-center">
      <div>Operational: {{ props.cfKvStatus }}</div>
      <div class="text-xs font-normal">
        checked {{ time }} sec ago from {{ location }} <br>
        {{ new Date().toUTCString() }}
      </div>
    </div>
  </div>
</template>
