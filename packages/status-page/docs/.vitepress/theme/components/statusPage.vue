<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loading = ref(true)
const success = ref(false)
const error = ref(false)

onMounted(() => {
  (async () => {
    const response = await fetch('/api/statuspage/', {
      method: 'GET',
    })
    const data = await response.json()
    if (data === true) {
      success.value = true
      loading.value = false
      console.log(data)
    }
    else {
      error.value = true
      console.log(data)
    }
  })()
})
</script>

<template>
  <template v-if="loading">
    Loading
  </template>
  <template v-else />
</template>
