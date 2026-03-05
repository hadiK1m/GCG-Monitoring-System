<template>
  <div class="space-y-4">
    <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Halaman ini belum tersedia. Silakan lanjutkan pengembangan modul ini.
      </p>
    </div>

    <div v-if="showRoute" class="rounded-xl bg-gray-50 dark:bg-gray-950/50 p-5">
      <div class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Route</div>
      <div class="mt-1 font-mono text-sm text-gray-700 dark:text-gray-300">
        {{ route.path }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  showRoute?: boolean
}>()

const route = useRoute()
</script>
