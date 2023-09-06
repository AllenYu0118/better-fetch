<template>
  <div>
    <div>
      <button @click="testClassObject">classObject</button>
    </div>
    <div>
      <button @click="testNormalObject">normalObject</button>
    </div>
    <div>
      <button @click="testClassObjectInNormalObject">
        classObjectInNormalObject
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
class Temp {
  test = 'hi';
}

const classObject = new Temp();
const normalObject = {
  test: 'hi',
};
const classObjectInNormalObject = {
  test: classObject,
};

const testClassObject = () => {
  $fetch<number>('/api/temp', {
    method: 'post',
    body: classObject,
  });
};
const testNormalObject = () => {
  $fetch<number>('/api/temp', {
    method: 'post',
    body: normalObject,
  });
};
const testClassObjectInNormalObject = () => {
  $fetch<number>('/api/temp', {
    method: 'post',
    body: classObjectInNormalObject,
  });
};
</script>
