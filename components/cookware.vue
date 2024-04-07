<script setup>
const props = defineProps(["name", "quantity", "type"]);
</script>

<template>{{ name }}{{ quantity > 1 ? ` ${quantity}` : null }}</template>
