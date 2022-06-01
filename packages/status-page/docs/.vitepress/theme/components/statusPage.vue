<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loading = ref(true)
const success = ref(false)
const error = ref(false)

onMounted(() => {
  fetch('/api/statuspage/').then(async (response) => {
    try {
      const data = await response.json()
      console.log('response data?', data)
    }
    catch (error) {
      console.log('Error happened here!')
      console.log(error)
    }
  })
  /*
  const data = await response
  if (data === true) {
    success.value = true
    loading.value = false
    console.log(data)
  }
  else {
    error.value = true
    console.log(data)
  }
  */
})
</script>

<template>
  <template v-if="loading">
    Loading
  </template>
  <template v-else />
</template>
