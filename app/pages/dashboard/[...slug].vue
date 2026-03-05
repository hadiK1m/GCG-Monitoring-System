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

    <div class="rounded-xl bg-gray-50 dark:bg-gray-950/50 p-5">
      <div class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Route
      </div>
      <div class="mt-1 font-mono text-sm text-gray-700 dark:text-gray-300">
        /dashboard/{{ slugPath }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()

const slugPath = computed(() => {
  const slug = route.params.slug
  if (Array.isArray(slug)) return slug.join('/')
  return String(slug || '')
})

const title = computed(() => {
  return slugPath.value
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, ' '))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' / ') || 'Dashboard'
})
</script>
