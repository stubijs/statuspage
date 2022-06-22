---
title: 'Statuspage build with Cloudflare Worker and Pages, Vitepress, Vite and Vue'
layout: page
---
<script setup>
import { defineAsyncComponent } from 'vue'
const statusPage = defineAsyncComponent(() => import('./.vitepress/theme/components/statusPage.vue'))
</script>

<h1 class="font-medium leading-tight text-4xl mt-0 mb-2">jstubenrauch System Status</h1>

jstubenrauch provides and uses numerous services that should be permanently monitored. This web page shows the status of each service. The data is determined using the Cloudflare network by measuring the Time To First Byte (TTFB).

<statusPage />

<h2 class="font-medium leading-tight text-4xl mt-0 mb-2">Host your own version</h2>

Are you interested in creating your own status page? Read our [setup guide](/setup/)
