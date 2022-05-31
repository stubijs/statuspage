<script setup lang="ts">
</script>

<template>
  <div
    key="{`${monitorId}-histogram`}"
    className="flex flex-row items-center histogram"
  >
    <template>
      <div key="{key}" className="hitbox tooltip">
        <div className="{`${bg}" bar`} />
        <div className="content text-center py-1 px-2 mt-2 left-1/2 -ml-20 w-40 text-xs">
          {dayInHistogram}
          <br>
          <span className="font-semibold text-sm">
            {dayInHistogramLabel}
          </span>
          {kvMonitor &&
          kvMonitor.checks.hasOwnProperty(dayInHistogram) &&
          Object.keys(kvMonitor.checks[dayInHistogram].res).map((key) => {
          return (
          <MonitorDayAverage
            location="{key}"
            avg="{kvMonitor.checks[dayInHistogram].res[key].a}"
          />
          )
          })}
        </div>
      </div>
    </template>
  </div>
</template>
