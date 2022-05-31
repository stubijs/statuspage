<script setup lang="ts">
</script>

<template>
  <div className="col-span-6 sm:col-span-3 relative">
    <input
      ref="{(e)"
      className="block w-full py-2 px-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      type="text"
      value="{input}"
      onInput="{handleInput}"
      onKeyDown="{handleKeyDown}"
      placeholder="Tap '/' to search"
      tabIndex="{0}" =
    > e && active && e.focus()}
    />
    <div className="absolute inset-y-1 right-1 flex z-1 items-center">
      {searchIcon}
    </div>
  </div>
</template>
