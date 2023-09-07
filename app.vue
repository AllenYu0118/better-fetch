<template>
  <div>
    <div>
      <h3>Fetch</h3>
      <button @click="simpleFetch">simple fetch</button>

      <p><button @click="composableFetch">composable fetch</button></p>
    </div>

    <div>
      <h3>Better Fetch</h3>
      <button @click="getData">getData</button>

      <p><button @click="getText">getText</button></p>

      <p><button @click="fetchTimeout">fetchTimeout 5s</button></p>

      <p><button @click="autoRetry">autoRetry</button></p>
    </div>
  </div>
</template>
<script setup lang="ts">
const simpleFetch = async () => {
  fetch('/api/getText')
    .then((response) => response.text())
    .then((text) => console.log('text: ', text));
};

const composableFetch = async () => {
  const headers = new Headers({
    token: 'bigStron',
  });

  const abortController = new AbortController();

  const request = new Request('/api/getData', {
    credentials: 'omit',
    mode: 'cors',
    headers: headers,
    signal: abortController.signal,
  });

  fetch(request)
    .then((response) => response.json())
    .then((json) => console.log('json: ', json))
    .catch((err) => {
      console.error(`fetch error: ${err.message}`);
    });

  setTimeout(() => {
    abortController.abort();
  }, 5000);
};

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

const fetchTimeout = async () => {
  const data = await $bfetch('https://bff.591.com.tw/home', { timeout: 5000 });
  console.log(data);
};

const autoRetry = async () => {
  const data = await $bfetch('https://google.com/404', {
    retry: 5,
  });
  console.log(data);
};
</script>
