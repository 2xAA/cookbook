<script setup>
import { useRecipesStore } from "../stores/recipes";
import { ref } from "vue";

function getFilename(path) {
  return path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
}

const searchTerm = ref("");

const store = useRecipesStore();
const recipes = computed(() => {
  if (searchTerm.value.length) {
    return store.recipes.filter((recipe) =>
      getFilename(recipe.metadata.import_path)
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
    );
  }

  return store.recipes;
});
</script>

<template>
  <r-grid columns="8">
    <r-cell span="1-7" span-s="1-6"><h1>Cookbook</h1></r-cell>
    <r-cell span-s="7-8" class="list_link-container">
      <h3><NuxtLink to="/shopping-list">List →</NuxtLink></h3>
    </r-cell>
    <r-cell span="row">
      <input aria-label="Search" type="search" v-model="searchTerm" />
    </r-cell>
    <r-cell span="row" v-if="!recipes.length">
      <h2>No recipes found for “{{ searchTerm }}”</h2>
    </r-cell>
    <r-cell span="row" v-for="{ metadata } in recipes">
      <h2>
        <NuxtLink :to="`/recipe/${getFilename(metadata.import_path)}`">
          {{ getFilename(metadata.import_path) }} →
        </NuxtLink>
      </h2>
    </r-cell>
  </r-grid>
</template>

<style>
h2 a {
  white-space: normal;
}
</style>
