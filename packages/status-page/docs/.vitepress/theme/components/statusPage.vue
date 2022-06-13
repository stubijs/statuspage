<script setup lang="ts">
import { onMounted, ref } from 'vue'
import config from './../../../../../../config.json'
// import data from './../../../../test/data/KV_default.json'

const loading = ref(true)
const error = ref(false)

let data = {}

onMounted(() => {
  fetch('/api/statuspage/').then(async (response) => {
    try {
      data = await response.json()
      loading.value = false
    }
    catch (error) {
      loading.value = false
      error.value = true
      // eslint-disable-next-line no-console
      console.log('Error happened here!')
      // eslint-disable-next-line no-console
      console.log(error)
    }
  })

  // loading.value = false
})
</script>

<template>
  <template v-if="loading">
    Loading...
  </template>
  <template v-else>
    <template v-if="error">
      ERROR
    </template>
    <template v-else>
      <div class="mt-8" style="min-height: calc(100vh - 220px);">
        <monitor-status-header :cf-kv-status="data.lastUpdate.allOperational" :cf-kv-number="data.lastUpdate.time" :cf-kv-loc="data.lastUpdate.loc" />
        <template v-for="(item, index) in config.monitors" :key="index">
          <monitor-card :card-item="data.monitors[item.id]" :card-monitor="item" />
        </template>
      </div>
    </template>
  </template>
</template>
