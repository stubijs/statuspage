<script setup lang="ts">
import { onMounted } from 'vue'
import { locations } from '../utils/locations'

interface monitorStatusHeader {
  cfKvStatus?: boolean
  cfKvNumber: number
  cfKvLoc?: string
}

const props = withDefaults(defineProps<monitorStatusHeader>(), {
  cfKvStatus: false,
  cfKvLoc: 'unknown',
})

onMounted(() => {
  const time = Math.round((Date.now() - props.cfKvNumber) / 1000)
  const location = locations[props.cfKvLoc] || 'unknown'
})
</script>

<template>
  <div class="card mb-4 font-semibold" :class="[props.cfKvStatus ? 'status-header-green' : 'status-header-yellow']">
    <div class="flex flex-row justify-between items-center">
      <div>Operational: {props.cfKvStatus}</div>
      <div class="text-xs font-light">
        checked { time } sec ago from {location}
      </div>
    </div>
  </div>
</template>
