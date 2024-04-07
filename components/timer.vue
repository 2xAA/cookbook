<script setup>
const props = defineProps(["name", "quantity", "units", "type"]);
</script>

<template>
  <b>{{ name }} {{ quantity }} {{ units }}</b>
</template>
