<script setup lang="ts">
import { computed } from 'vue'
import { locations } from '../utils/locations'

const props = defineProps({
  dataResItem: Object,
  dataResIndex: String,
})

const location = computed(() => { return locations[props.dataResIndex] || 'unknown' })
</script>

<template>
  <br>
  <small>
    {{ location }}: {{ props.dataResItem.a }} ms ({{ props.dataResItem.n }})
  </small>
</template>
