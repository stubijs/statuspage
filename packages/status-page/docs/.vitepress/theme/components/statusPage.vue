<script setup lang="ts">
import { onMounted, ref } from 'vue'

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
      {{ data }}
    </template>
  </template>
</template>
