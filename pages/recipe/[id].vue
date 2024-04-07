<script setup>
import { useRecipesStore } from "../../stores/recipes";
import { useShoppingListStore } from "../../stores/shopping-list";
import { getFilename } from "../../utils/getFilename";
import text from "../../components/text.vue";
import ingredient from "../../components/ingredient.vue";
import cookware from "../../components/cookware.vue";
import timer from "../../components/timer.vue";

const shoppingListStore = useShoppingListStore();
const route = useRoute();

const stepsComponents = {
  text,
  ingredient,
  cookware,
  timer,
};

function stripImportPath(object) {
  const obj = { ...object };
  delete obj.import_path;
  delete obj.source;
  delete obj.time;
  return obj;
}

const store = useRecipesStore();
const recipe = store.getRecipeByFilename(route.params.id);

const { ingredients, cookwares, metadata, steps, shoppingList } = recipe;

const title = getFilename(metadata?.import_path);

const hasRecipeInList = computed(() =>
  shoppingListStore.hasRecipeInList(title)
);

function addRecipeToList() {
  shoppingListStore.addToList({ title, ingredients });
}

const addToListButtonText = computed(() =>
  hasRecipeInList.value ? "Added to List" : "Add to List"
);

let hours;
let minutes;
let hasTime = false;
if ("time" in metadata) {
  hasTime = true;
  hours = Math.floor(metadata.time / 60);
  minutes = metadata.time % 60;
}

let isVegan = metadata?.vegan === "true";
</script>

<template>
  <div>
    <Title>{{ title }}</Title>

    <r-grid columns="8">
      <r-cell span="1-7" span-s="1-4">
        <h3><NuxtLink to="/">↩ Home</NuxtLink></h3>
      </r-cell>
      <r-cell span-s="5-8" style="text-align: right">
        <h3><NuxtLink to="/shopping-list">List →</NuxtLink></h3>
      </r-cell>
    </r-grid>

    <article>
      <r-grid columns="8">
        <r-cell span="1-6" span-s="row">
          <h1>{{ title }}</h1>
        </r-cell>
        <r-cell span="7-8" span-s="row" class="list-button-container">
          <button @click="addRecipeToList" :disabled="hasRecipeInList">
            <h3>{{ addToListButtonText }}</h3>
          </button>
        </r-cell>
        <r-cell span="1-2" span-s="row">
          <!-- <ul style="list-style: none"> -->
          <!-- <li v-for="(value, key) in stripImportPath(metadata)">
              {{ key }}: {{ value }}
            </li> -->
          <div v-if="isVegan">Vegan</div>
          <div v-if="hasTime">
            ⌚︎ <span v-if="!!hours">{{ hours }}h </span>
            <span v-if="minutes > 0">{{ minutes }}m</span>
          </div>
          <div>
            <a
              target="_blank"
              :href="`/recipes/${getFilename(metadata.import_path)}.cook`"
            >
              Download .cook ↓
            </a>
          </div>
          <!-- </ul> -->

          <h2>Ingredients</h2>
          <ul>
            <li v-for="{ name, quantity, units } in ingredients">
              {{ quantity }}{{ units }}
              {{ !units && typeof quantity === "number" ? "×" : "" }}
              {{ name }}
            </li>
          </ul>

          <h2 v-if="cookwares?.length">Equipment</h2>
          <ul v-if="cookwares?.length">
            <li v-for="{ name, quantity, units } in cookwares">
              {{ quantity }} {{ !isNaN(Number(quantity)) ? "×" : "" }}
              {{ name }}
            </li>
          </ul>
        </r-cell>
        <r-cell span="3-8" span-s="row" class="steps">
          <h2>Steps</h2>
          <ol>
            <li v-for="step in steps">
              <component
                v-for="item in step"
                :is="stepsComponents[item.type]"
                v-bind="item"
              ></component>
            </li>
          </ol>
        </r-cell>
      </r-grid>
    </article>
  </div>
</template>
