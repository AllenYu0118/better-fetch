<template>
  <div>
    <button @click="getData">getData</button>
  </div>
</template>
<script setup lang="ts">
const getData = () => {
  $bfetch('/api/getData', {
    headers: {
      Token: 'better-fetch-client',
    },
  });
};
</script>
