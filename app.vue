<template>
  <div>
    <button @click="getData">getData</button>

    <p><button @click="getText">getText</button></p>
  </div>
</template>
<script setup lang="ts">
const getData = async () => {
  const data = await $bfetch('/api/getData', {
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

  console.log(data);
};

const getText = async () => {
  const data = await $bfetch('/api/getText');

  console.log(data);
};
</script>
