export const useShoppingListStore = defineStore(
  "shopping-list",
  () => {
    const list = ref([]);

    function addToList(recipe) {
      list.value.push({
        title: recipe.title,
        ingredients: recipe.ingredients.map((ingredient, index) => ({
          done: false,
          index,
          ...ingredient,
        })),
      });
    }

    function removeFromList(recipeTitle) {
      const recipeIndex = list.value.findIndex(
        (recipe) => recipe.title === recipeTitle
      );

      list.value.splice(recipeIndex, 1);
    }

    const hasRecipeInList = computed(() => (title) => {
      return !!list.value.find((item) => item.title === title);
    });

    const updateIngredientDone = (recipeTitle, ingredientIndex, done) => {
      const recipeIndex = list.value.findIndex(
        (recipe) => recipe.title === recipeTitle
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
