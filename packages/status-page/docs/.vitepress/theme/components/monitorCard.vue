<script setup lang="ts">
</script>

<template>
  <div key="{key}" className="card">
    <div className="flex flex-row justify-between items-center mb-2">
      <div className="flex flex-row items-center align-center">
        {monitor.description && (
        <div className="tooltip">
          {infoIcon}
          <div className="content text-center transform -translate-y-1/2 top-1/2 ml-8 w-72 text-sm object-left">
            {monitor.description}
          </div>
        </div>
        )}
        {(monitor.linkable === true || monitor.linkable === undefined) ?
        (
        <a href="{monitor.url}" target="_blank">
          <div className="text-xl">{monitor.name}</div>
        </a>
        )
        :
        (
        <span>
          <div className="text-xl">{monitor.name}</div>
        </span>
        )
        }
      </div>
      <MonitorStatusLabel kv-monitor="{data}" />
    </div>

    <MonitorHistogram monitor-id="{monitor.id}" kv-monitor="{data}" />

    <div className="flex flex-row justify-between items-center text-gray-400 text-sm">
      <div>{config.settings.daysInHistogram} days ago</div>
      <div>Today</div>
    </div>
  </div>
</template>
