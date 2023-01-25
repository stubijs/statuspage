<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '@vueuse/core'
import config from './../../../../../../config.json'
// import data from './../../../../../../test/data/KV_default.json'

const url = '/api/statuspage/'

const {
  data,
  error,
  isFetching,
  isFinished,
} = useFetch(url).get()

const dataReturn: WorkerMonitorState = computed(() => {
  try {
    return JSON.parse(data.value as string)
  }
  catch (e) {
    return { lastUpdate: { allOperational: true }, monitors: {} }
  }
}) as unknown as WorkerMonitorState
</script>

<template>
  <template v-if="isFetching">
    <loading-comp />
  </template>
  <template v-else>
    <template v-if="error">
      <error-comp />
    </template>
  </template>

  <template v-if="isFinished">
    <div class="mt-8" style="min-height: calc(100vh - 220px);">
      <monitor-status-header :cf-kv-status="dataReturn.lastUpdate.allOperational" :cf-kv-number="dataReturn.lastUpdate.time" :cf-kv-loc="dataReturn.lastUpdate.loc" />
      <template v-for="(item, index) in config.monitors" :key="index">
        <monitor-card :card-item="dataReturn.monitors[item.id]" :card-monitor="item" />
      </template>
    </div>
  </template>
</template>
