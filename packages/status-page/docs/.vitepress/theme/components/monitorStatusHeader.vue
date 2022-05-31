<script setup lang="ts">
</script>

<template>
  <div className="{`card" mb-4 font-semibold ${classes[color]}`}>
    <div className="flex flex-row justify-between items-center">
      <div>{text}</div>
      {kvMonitorsLastUpdate.time && typeof window !== 'undefined' && (
      <div className="text-xs font-light">
        checked{' '}
        {Math.round((Date.now() - kvMonitorsLastUpdate.time) / 1000)} sec
        ago (from{' '}
        {locations[kvMonitorsLastUpdate.loc] || kvMonitorsLastUpdate.loc})
      </div>
      )}
    </div>
  </div>
</template>
