<script setup>
import Ingredient from "./ingredient.vue";

const props = defineProps({
  ingredients: { type: Array, required: true },
  scale: { type: Number, default: 1 },
});

const reducedIngredients = computed(() => {
  return props.ingredients.reduce((obj, ingredient) => {
    const { name, quantity, units } = ingredient;
    const qValue = Number(quantity);
    const isNumber = !isNaN(qValue);
    const scaledQuantity = isNumber ? qValue * props.scale : quantity;

    if (!obj[name]) {
      obj[name] = { name, quantity: scaledQuantity, units };
    } else {
      obj[name].quantity += scaledQuantity;
    }

    return obj;
  }, {});
});
</script>

<template>
  <ul>
    <li v-for="ingredient in reducedIngredients">
      <Ingredient v-bind="ingredient" />
    </li>
  </ul>
</template>
