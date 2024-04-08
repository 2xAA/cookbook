<script setup>
const props = defineProps(["quantity", "units"]);
</script>

<template>{{ quantity }}{{ units.length > 2 ? ` ${units}` : units }}</template>
