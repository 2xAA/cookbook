<script setup>
const props = defineProps(["name", "quantity", "units", "type"]);
</script>

<template>
  <span class="ingredient">{{ quantity }} {{ units }} {{ name }}</span>
</template>

<style scoped>
.ingredient {
  text-decoration: underline;
}
</style>
