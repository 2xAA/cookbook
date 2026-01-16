const modules = import.meta.glob("../public/recipes/*.cook");

function transformTextToNotes(recipe) {
  if (!recipe.steps) return recipe;

  recipe.steps = recipe.steps.map((step) =>
    step.map((item) => {
      if (item.type === "text" && item.value.startsWith("> ")) {
        return { ...item, type: "note", value: item.value.slice(2) };
      }
      return item;
    })
  );

  return recipe;
}

async function loadImports() {
  const promises = [];

  for (const path in modules) {
    promises.push(modules[path]());
  }

  const recipes = await Promise.all(promises);
  return recipes.map((mod) => transformTextToNotes({ ...mod.default }));
}

export const useRecipesStore = defineStore("recipes", () => {
  const recipes = ref([]);

  async function getRecipes() {
    return loadImports()
      .then((data) => {
        recipes.value = data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getRecipes();

  function getRecipeByFilename(filename) {
    return (
      recipes.value.filter(
        ({ metadata: { import_path } }) => getFilename(import_path) === filename
      )[0] || {}
    );
  }

  return {
    recipes,
    getRecipes,
    getRecipeByFilename,
  };
});
