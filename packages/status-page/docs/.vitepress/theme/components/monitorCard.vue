<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import config from './../../../../../../config.json'
import loadingComp from './loadingComp.vue'
import errorComp from './errorComp.vue'

const props = defineProps({
  cardItem: Object,
  cardMonitor: Object,
})

const daysHistogram = [...Array(config.settings.daysInHistogram)].map((_, i) => i)

const showData = ref('')

function changeDataView(dataValue: string) {
  if (showData.value === dataValue)
    showData.value = ''
  else
    showData.value = dataValue
}

const monitorMap = defineAsyncComponent({
  // the loader function
  loader: () => import('./monitorMap.vue'),

  // A component to use while the async component is loading
  loadingComponent: loadingComp,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,

  // A component to use if the load fails
  errorComponent: errorComp,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000,
})

const monitorTable = defineAsyncComponent({
  // the loader function
  loader: () => import('./monitorTable.vue'),

  // A component to use while the async component is loading
  loadingComponent: loadingComp,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,

  // A component to use if the load fails
  errorComponent: errorComp,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000,
})
</script>

<template>
  <div class="card">
    <div class="flex flex-row justify-between items-center m-6 mb-4">
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
            <div class="text-base md:text-xl">{{ cardMonitor.name }}</div>
          </a>
        </template>
        <template v-else>
          <span>
            <div class="text-base md:text-xl">{{ cardMonitor.name }}</div>
          </span>
        </template>
      </div>
      <monitor-status-label :status-label="cardItem.lastCheck.operational" />
    </div>
    <div class="mx-6 mb-1">
      <div class="flex flex-row items-center histogram">
        <template v-for="index in daysHistogram" :key="index">
          <MonitorHistogram :monitor-data="props.cardItem" :monitor-day="index" />
        </template>
      </div>
    </div>
    <div class="m-6 mt-0">
      <div class="flex flex-row justify-between items-center text-gray-400 text-sm">
        <div>{{ config.settings.daysInHistogram }} days ago</div>
        <div>Today</div>
      </div>
    </div>
    <div class="px-6 border-t">
      <div class="flex items-center justify-center gap-4 my-4">
        <div class="button-card" @click="changeDataView('map')">
          <template v-if="showData === 'map'">
            Hide
          </template>
          <template v-else>
            Show
          </template>
          Map
        </div>
        <div class="button-card" @click="changeDataView('table')">
          <template v-if="showData === 'table'">
            Hide
          </template>
          <template v-else>
            Show
          </template>
          Table
        </div>
      </div>
      <template v-if="showData === 'map'">
        <monitorMap :svg-data="props.cardItem" :svg-org-lon="cardMonitor.lon" :svg-org-lat="cardMonitor.lat" />
      </template>
      <template v-if="showData === 'table'">
        <monitorTable :svg-data="props.cardItem" />
      </template>
    </div>
  </div>
</template>
