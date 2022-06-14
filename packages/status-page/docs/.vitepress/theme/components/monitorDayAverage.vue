<script setup lang="ts">
import { computed } from 'vue'
import locations from './../../../../../locations/locations.json'

const props = defineProps({
  dataResItem: Object,
  dataResIndex: String,
})

const location = computed(() => { return locations[props.dataResIndex].city || 'unknown' })
</script>

<template>
  <p>
    <small>
      {{ location }}: {{ props.dataResItem.a }} ms ({{ props.dataResItem.n }})
    </small>
  </p>
</template>
