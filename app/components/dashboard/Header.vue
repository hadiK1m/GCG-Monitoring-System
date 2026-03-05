<!--
  Header.vue
  Top bar / Navbar for the dashboard layout.
  Features:
  - Hamburger menu (mobile)
  - Breadcrumb navigation
  - Environment badges (Production, Staging, Development)
  - Notification bell
  - User profile dropdown
-->
<template>
  <header
    class="
      sticky top-0 z-30
      flex items-center justify-between
      h-16 px-4 lg:px-6
      bg-white dark:bg-gray-900
      border-b border-gray-200 dark:border-gray-800
    "
  >
    <!-- Left Section -->
    <div class="flex items-center gap-3 flex-1">
      <!-- Hamburger Menu (mobile only) -->
      <button
        type="button"
        class="lg:hidden flex items-center justify-center size-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        aria-label="Toggle sidebar"
        @click="toggleSidebar"
      >
        <UIcon name="i-lucide-menu" class="size-5 text-gray-600 dark:text-gray-300" />
      </button>

      <!-- Breadcrumbs -->
      <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 min-w-0">
        <template v-for="(crumb, index) in breadcrumbs" :key="crumb.to">
          <UIcon
            v-if="index > 0"
            name="i-lucide-chevron-right"
            class="size-4 text-gray-400 shrink-0"
          />

          <NuxtLink
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.to"
            class="text-sm text-gray-600 dark:text-gray-300 hover:text-gcg-primary dark:hover:text-gcg-accent transition-colors truncate"
          >
            {{ crumb.label }}
          </NuxtLink>

          <span
            v-else
            class="text-sm font-medium text-gray-900 dark:text-white truncate"
          >
            {{ crumb.label }}
          </span>
        </template>
      </nav>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-2 lg:gap-3">
      <!-- Dark Mode Toggle -->
      <button
        type="button"
        class="flex items-center justify-center size-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        aria-label="Toggle dark mode"
        @click="toggleColorMode"
      >
        <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-5 text-gray-600 dark:text-gray-300" />
      </button>

      <!-- Notifications -->
      <button
        type="button"
        class="relative flex items-center justify-center size-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <UIcon name="i-lucide-bell" class="size-5 text-gray-600 dark:text-gray-300" />
        <!-- Notification badge -->
        <span class="absolute top-1 right-1 size-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
      </button>

      <!-- User Profile Dropdown -->
      <UDropdownMenu
        :items="userMenuItems"
        :popper="{ placement: 'bottom-end' }"
      >
        <button
          type="button"
          class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <div class="size-8 rounded-full bg-gcg-primary flex items-center justify-center">
            <span class="text-white text-sm font-semibold">A</span>
          </div>
          <div class="hidden lg:block text-left">
            <p class="text-sm font-medium text-gcg-dark dark:text-white leading-tight">Admin User</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight">admin@gcg.com</p>
          </div>
          <UIcon name="i-lucide-chevron-down" class="hidden lg:block size-4 text-gray-400" />
        </button>
      </UDropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  pageTitle?: string
}>()

const route = useRoute()

const { toggleSidebar } = useSidebar()

type BreadcrumbItem = {
  label: string
  to: string
}

const breadcrumbLabelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  acgs: 'Kertas Kerja ACGS',
}

function titleCaseFromSegment(segment: string) {
  const decoded = decodeURIComponent(segment)
  return decoded
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const segments = route.path.split('/').filter(Boolean)
  if (segments.length === 0) return [{ label: 'Home', to: '/' }]

  const items: BreadcrumbItem[] = []
  let currentPath = ''

  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index]!
    currentPath += `/${segment}`

    const mapped = breadcrumbLabelMap[segment]
    let label = mapped ?? titleCaseFromSegment(segment)

    const isLast = index === segments.length - 1
    if (isLast && typeof route.meta?.title === 'string' && route.meta.title.trim()) {
      label = route.meta.title
    }

    items.push({ label, to: currentPath })
  }

  return items
})

// Dark mode
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// User dropdown menu items
const userMenuItems = [
  [{
    label: 'Profile',
    icon: 'i-lucide-user',
  }, {
    label: 'Settings',
    icon: 'i-lucide-settings',
  }],
  [{
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    click: () => navigateTo('/login'),
  }],
]
</script>
