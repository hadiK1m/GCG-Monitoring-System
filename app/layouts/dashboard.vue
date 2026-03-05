<!--
  Dashboard Layout — /layouts/dashboard.vue
  Wraps all dashboard pages with Sidebar + Header.
  Responsive: sidebar drawer on mobile, fixed on desktop.
-->
<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar -->
    <DashboardSidebar />

    <!-- Main Content Area -->
    <div
      class="flex flex-col flex-1 min-w-0 overflow-hidden"
      :class="isCollapsed ? 'lg:pl-20' : 'lg:pl-64'"
    >
      <!-- Header -->
      <DashboardHeader :page-title="pageTitle" />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <!-- Breadcrumb -->
        <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm mb-4">
          <NuxtLink to="/dashboard" class="text-gray-400 dark:text-gray-500 hover:text-gcg-primary dark:hover:text-gcg-accent transition-colors">
            Dashboard
          </NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="size-3.5 text-gray-400 dark:text-gray-600" />
          <span class="text-gcg-dark dark:text-white font-medium">{{ pageTitle }}</span>
        </nav>

        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { isCollapsed } = useSidebar()

// Derive page title from route meta or path
const pageTitle = computed(() => {
  // Check route meta first
  if (route.meta?.title) return route.meta.title as string

  // Fallback: derive from path
  const segments = route.path.split('/').filter(Boolean)
  const last = segments[segments.length - 1] || 'Dashboard'
  return last
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})
</script>
