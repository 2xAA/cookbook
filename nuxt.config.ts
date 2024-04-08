// https://nuxt.com/docs/api/configuration/nuxt-config
import cooklang from "vite-plugin-cooklang";

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
  vite: {
    plugins: [cooklang()],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["r-grid", "r-cell"].includes(tag),
    },
  },
  piniaPersistedstate: {
    storage: "localStorage",
  },
});
