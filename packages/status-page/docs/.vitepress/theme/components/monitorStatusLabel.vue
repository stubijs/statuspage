<script setup lang="ts">
import { computed } from 'vue'
import config from './../../../../../../config.json'

interface monitorStatusLabel {
  statusLabel: boolean
}

const props = withDefaults(defineProps<monitorStatusLabel>(), {
  statusLabel: false,
})

const color = computed(() => {
  return props.statusLabel ? 'status-label-green' : 'status-label-yellow'
})
</script>

<template>
  <div class="pill leading-5" :class="color">
    {{ props.statusLabel ? config.settings.monitorLabelOperational : config.settings.monitorLabelNotOperational }}
  </div>
</template>
