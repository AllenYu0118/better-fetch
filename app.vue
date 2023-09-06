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
    onRequest(context) {
      const { request, options } = context;
      context.request += '?a=1';
      console.log('[fetch request]', request, options.headers.Token);
      options.query = { a: 1, b: 2 };
    },
    onResponse({ request, response, options }) {
      console.log('[fetch response]', request, response.status, options.query);
    },
  });
};
</script>
