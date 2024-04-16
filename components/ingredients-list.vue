<script setup>
import Ingredient from "./ingredient.vue";

const { ingredients } = defineProps(["ingredients"]);

const reducedIngredients = ingredients.reduce((obj, ingredient) => {
  const { name, quantity, units } = ingredient;

  if (!obj[name]) {
    obj[name] = { name, quantity, units };
  } else {
    obj[name].quantity += quantity;
  }

  return obj;
}, {});
</script>

<template>
  <ul>
    <li v-for="ingredient in reducedIngredients">
      <Ingredient v-bind="ingredient" />
    </li>
  </ul>
</template>
