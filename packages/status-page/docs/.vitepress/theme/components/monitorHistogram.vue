<script setup lang="ts">
import { computed } from 'vue'
import config from './../../../../../../config.json'

const props = defineProps({
  monitorData: Object,
  monitorDay: Number,
})

const date = new Date()
date.setDate(date.getDate() - config.settings.daysInHistogram + props.monitorDay + 1)
const dayIndex = date.toISOString().split('T')[0]

const colorbar = computed(() => {
  if (props.monitorData.checks[dayIndex]) {
    if (props.monitorData.checks[dayIndex].fails > 0) {
      if (Object.prototype.hasOwnProperty.call(props.monitorData.checks[dayIndex], 'res') && Object.keys(props.monitorData.checks[dayIndex].res).length > 0)
        return 'bar yellow'
      else
        return 'bar red'
    }
    else {
      return 'bar green'
    }
  }
  else {
    return 'bar'
  }
})

const operationLabel = computed(() => {
  if (props.monitorData.checks[dayIndex]) {
    if (props.monitorData.checks[dayIndex].fails > 0) {
      if (Object.prototype.hasOwnProperty.call(props.monitorData.checks[dayIndex], 'res') && Object.keys(props.monitorData.checks[dayIndex].res).length > 0)
        return config.settings.monitorLabelPartOperational
      else
        return config.settings.monitorLabelNotOperational
    }
    else {
      return config.settings.monitorLabelOperational
    }
  }
  else {
    return config.settings.monitorLabelNoData
  }
})

const showPings = computed(() => {
  if (props.monitorData.checks[dayIndex]) {
    if (props.monitorData.checks[dayIndex].fails > 0) {
      if (Object.prototype.hasOwnProperty.call(props.monitorData.checks[dayIndex], 'res') && Object.keys(props.monitorData.checks[dayIndex].res).length > 0)
        return true
      else
        return false
    }
    else {
      return true
    }
  }
  else {
    return false
  }
})
</script>

<template>
  <div class="hitbox tooltip">
    <div :class="colorbar" />
    <div class="content text-center py-1 px-2 mt-2 left-1/2 -ml-20 w-32 text-xs">
      {{ dayIndex }}
      <p class="my-1 font-semibold text-sm">
        {{ operationLabel }}
      </p>
      <template v-if="showPings">
        <template v-for="(item, key) in props.monitorData.checks[dayIndex].res" :key="key">
          <Monitor-day-average :data-res-item="item" :data-res-index="key" />
        </template>
      </template>
    </div>
  </div>
</template>
