<script setup lang="ts">
</script>

<template>
  <div class="flex justify-center my-8">
    <div class="dot-pulse" />
  </div>
</template>

<style>
.dot-pulse
{
  position:relative;
  left:-9999px;
  width:10px;
  height:10px;
  border-radius:5px;
  background-color:var(--vp-c-green);
  color:var(--vp-c-green);
  box-shadow:9999px 0 0 -5px;
  animation:dot-pulse 1.5s infinite linear;
  animation-delay:.25s
}

.dot-pulse::before,.dot-pulse::after
{
  content:'';
  display:inline-block;
  position:absolute;
  top:0;
  width:10px;
  height:10px;
  border-radius:5px;
  background-color:var(--vp-c-green);
  color:var(--vp-c-green)
}

.dot-pulse::before
{
  box-shadow:9984px 0 0 -5px;
  animation:dot-pulse-before 1.5s infinite linear;
  animation-delay:0s
}

.dot-pulse::after
{
  box-shadow:10014px 0 0 -5px;
  animation:dot-pulse-after 1.5s infinite linear;
  animation-delay:.5s
}

@keyframes dot-pulse-before {
  0%
  {
    box-shadow:9984px 0 0 -5px
  }

  30%
  {
    box-shadow:9984px 0 0 2px
  }

  60%,100%
  {
    box-shadow:9984px 0 0 -5px
  }
}

@keyframes dot-pulse {
  0%
  {
    box-shadow:9999px 0 0 -5px
  }

  30%
  {
    box-shadow:9999px 0 0 2px
  }

  60%,100%
  {
    box-shadow:9999px 0 0 -5px
  }
}

@keyframes dot-pulse-after {
  0%
  {
    box-shadow:10014px 0 0 -5px
  }

  30%
  {
    box-shadow:10014px 0 0 2px
  }

  60%,100%
  {
    box-shadow:10014px 0 0 -5px
  }
}
</style>
