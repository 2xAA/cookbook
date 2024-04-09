<template>
  <VitePwaManifest />
  <NuxtPage />
</template>

<script setup>
import { useRecipesStore } from "../stores/recipes";
import "./styles/raster2.css";
import "./styles/raster.grid.css";
import "./styles/style.css";

const store = useRecipesStore();
await store.getRecipes();

useHead({
  titleTemplate: (title) => {
    return title ? `${title} - Cookbook` : "Cookbook";
  },
});

// onMounted(() => {
//   document
//     .querySelector('meta[name="theme-color"]')
//     .setAttribute("content", "#123456");
// });
</script>
