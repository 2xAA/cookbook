export const useShoppingListStore = defineStore(
  "shopping-list",
  () => {
    const list = ref([]);

    function addToList(recipe) {
      list.value.push({
        name: recipe.name,
        ingredients: recipe.ingredients.map((ingredient, index) => ({
          done: false,
          index,
          ...ingredient,
        })),
      });
    }

    function removeFromList(recipeName) {
      const recipeIndex = list.value.findIndex(
        (recipe) => recipe.name === recipeName
      );

      list.value.splice(recipeIndex, 1);
    }

    const hasRecipeInList = computed(() => (name) => {
      return !!list.value.find((item) => item.name === name);
    });

    const updateIngredientDone = (recipeName, ingredientIndex, done) => {
      const recipeIndex = list.value.findIndex(
        (recipe) => recipe.name === recipeName
      );
      list.value[recipeIndex].ingredients[ingredientIndex].done = done;
    };

    return {
      list,
      addToList,
      hasRecipeInList,
      updateIngredientDone,
      removeFromList,
    };
  },
  {
    persist: true,
  }
);
