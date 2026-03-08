// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],

  nitro: {
    esbuild: {
      options: { target: 'es2022' },
    },
  },

  build: {
    transpile: ['@prisma/client'],
  },
})
