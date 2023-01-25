<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import _locations from './../../../../../locations/locations.json'

const props = defineProps({
  dataResItem: { type: Object as PropType<MonitorResItem>, required: true },
  dataResIndex: { type: String, required: true },
})

// fix: Typescript does set wrong type
const locations: locations = _locations

const location = computed(() => {
  return locations[props.dataResIndex].city || 'unknown'
})
</script>

<template>
  <p>
    <small>
      {{ location }}: {{ props.dataResItem.a }} ms ({{ props.dataResItem.n }})
    </small>
  </p>
</template>
