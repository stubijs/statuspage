<script setup lang="ts">
import config from './../../../../../../config.json'

const props = defineProps({
  cardItem: Object,
  cardMonitor: Object,
})

const daysHistogram = [...Array(config.settings.daysInHistogram)].map((_, i) => i)
</script>

<template>
  <div class="card">
    <div class="flex flex-row justify-between items-center mb-2">
      <div class="flex flex-row items-center align-center">
        <template v-if="cardMonitor.description">
          <div class="tooltip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-5 mr-2 mx-auto text-blue-500 dark:text-blue-400"
            >
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="content text-center transform -translate-y-1/2 top-1/2 ml-8 w-72 text-sm object-left">
              {{ cardMonitor.description }}
            </div>
          </div>
        </template>
        <template v-if="cardMonitor.linkable === true || cardMonitor.linkable === undefined">
          <a :href="cardMonitor.url" target="_blank">
            <div class="text-xl">{{ cardMonitor.name }}</div>
          </a>
        </template>
        <template v-else>
          <span>
            <div class="text-xl">{{ cardMonitor.name }}</div>
          </span>
        </template>
      </div>
      <monitor-status-label :status-label="cardItem.lastCheck.operational" />
    </div>
    <div class="flex flex-row items-center histogram">
      <template v-for="index in daysHistogram" :key="index">
        <MonitorHistogram :monitor-data="props.cardItem" :monitor-day="index" />
      </template>
    </div>

    <div class="flex flex-row justify-between items-center text-gray-400 text-sm">
      <div>{{ config.settings.daysInHistogram }} days ago</div>
      <div>Today</div>
    </div>
  </div>
</template>
