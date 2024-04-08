<script setup>
const props = defineProps({
  name: String,
  quantity: Number,
  type: String,
  underline: { type: Boolean, default: false },
  units: String,
});
</script>

<template>
  <span :class="{ ingredient: underline }">
    <IngredientQuantity :quantity="quantity" :units="units" /> {{ name }}
  </span>
</template>

<style scoped>
.ingredient {
  text-decoration: underline;
}
</style>
