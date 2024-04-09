// https://nuxt.com/docs/api/configuration/nuxt-config
import cooklang from "vite-plugin-cooklang";

const sw = process.env.SW === "true";

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
      meta: [
        {
          name: "theme-color",
          media: "(prefers-color-scheme: light)",
          content: "white",
        },
        {
          name: "theme-color",
          media: "(prefers-color-scheme: dark)",
          content: "black",
        },
      ],
    },
  },
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@vite-pwa/nuxt",
  ],
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
  pwa: {
    strategies: sw ? "injectManifest" : "generateSW",
    // srcDir: sw ? "service-worker" : undefined,
    // filename: sw ? "sw.ts" : undefined,
    registerType: "autoUpdate",
    manifest: {
      name: "Cookbook",
      short_name: "Cookbook",
      theme_color: "#ffffff",
      icons: [
        {
          src: "Cookbook-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/rsms.me\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "rsms-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      // navigateFallback: "/",
      // navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
});
