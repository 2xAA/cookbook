const modules = import.meta.glob("../public/recipes/*.cook");

async function loadImports() {
  const promises = [];

  for (const path in modules) {
    promises.push(modules[path]());
  }

  const recipes = await Promise.all(promises);
  return recipes.map((mod) => ({ ...mod.default }));
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
