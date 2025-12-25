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
// Use computed to make recipe reactive to store changes
const recipe = computed(() => store.getRecipeByFilename(route.params.id));

// Computed properties for recipe parts
const ingredients = computed(() => recipe.value.ingredients || []);
const cookwares = computed(() => recipe.value.cookwares || []);
const metadata = computed(() => recipe.value.metadata || {});
const steps = computed(() => recipe.value.steps || []);

const name = computed(() => getFilename(metadata.value?.import_path));

const hasRecipeInList = computed(() => shoppingListStore.hasRecipeInList(name.value));

function addRecipeToList() {
  shoppingListStore.addToList({ name: name.value, ingredients: ingredients.value });
}

const addToListButtonText = computed(() =>
  hasRecipeInList.value ? "Added to List" : "Add to List"
);

const timeData = computed(() => {
  if ("time" in metadata.value) {
    return {
      hasTime: true,
      hours: Math.floor(metadata.value.time / 60),
      minutes: metadata.value.time % 60,
    };
  }
  return { hasTime: false, hours: 0, minutes: 0 };
});

const isVegan = computed(() => metadata.value?.vegan === "true");
const hasSource = computed(() => !!metadata.value?.source);
const hasServings = computed(() => (Number(metadata.value?.servings) || 0) > 0);

// Scaling Logic
const currentServings = ref(1);

// Initialize currentServings when metadata loads or changes
watch(metadata, (newMeta) => {
  if (newMeta?.servings) {
    currentServings.value = Number(newMeta.servings);
  } else {
    currentServings.value = 1;
  }
}, { immediate: true });

const scale = computed(() => {
  const base = Number(metadata.value?.servings) || 1;
  return currentServings.value / base;
});

function updateServings(delta) {
  const newVal = currentServings.value + delta;
  if (newVal >= 1) currentServings.value = newVal;
}

function bindWrapper(item) {
  const props = { ...item };
  if (item.type === "ingredient") {
    props.underline = true;
    const qValue = Number(props.quantity);
    if (!isNaN(qValue)) {
      props.quantity = qValue * scale.value;
    }
  }

  // Scale time if enabled
  const scaleTime = metadata.value?.scaleTime === true || metadata.value?.scaleTime === "true";
  if (item.type === "timer" && scaleTime) {
    const qValue = Number(props.quantity);
    if (!isNaN(qValue)) {
      props.quantity = qValue * scale.value;
    }
  }

  return props;
}
</script>

<template>
  <div>
    <Title>{{ name }}</Title>

    <r-grid columns="8">
      <r-cell span="1-7" span-s="1-4">
        <h3><NuxtLink to="/">↩ Home</NuxtLink></h3>
      </r-cell>
      <r-cell span-s="5-8" class="list_link-container">
        <h3><NuxtLink to="/shopping-list">List →</NuxtLink></h3>
      </r-cell>
    </r-grid>

    <article>
      <r-grid columns="8">
        <r-cell span="1-5" span-s="row">
          <h1>{{ name }}</h1>
        </r-cell>
        <r-cell span="6-8" span-s="row" class="list-button-container">
          <button @click="addRecipeToList" :disabled="hasRecipeInList">
            <h3>{{ addToListButtonText }}</h3>
          </button>
        </r-cell>
        <r-cell span="1-2" span-s="row">
          <div v-if="isVegan">Vegan</div>

          <div v-if="hasServings" class="servings-control">
             <button @click="updateServings(-1)" aria-label="Decrease servings">-</button>
             <span>Serves: {{ currentServings }}</span>
             <button @click="updateServings(1)" aria-label="Increase servings">+</button>
          </div>

          <div v-if="timeData.hasTime">
            ⌚︎ <span v-if="!!timeData.hours">{{ timeData.hours }}h </span>
            <span v-if="timeData.minutes > 0">{{ timeData.minutes }}m</span>
          </div>
          <div v-if="hasSource">
            <a target="_blank" :href="metadata.source"> Source ↗ </a>
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
          <IngredientsList :ingredients="ingredients" :scale="scale" />

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
                v-bind="bindWrapper(item)"
              ></component>
            </li>
          </ol>
        </r-cell>
      </r-grid>
    </article>
  </div>
</template>

<style scoped>
.servings-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.servings-control button {
  background: none;
  border: 1px solid currentColor;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.servings-control button:hover {
  background-color: rgba(0,0,0,0.1);
}
</style>
