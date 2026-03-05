<!--
  IT Admin Dashboard — /pages/dashboard/it-admin.vue
  Main dashboard view with stat cards and placeholder widgets.
-->
<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gcg-dark dark:text-white">
        IT Admin Dashboard
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Monitor system health, users, and infrastructure at a glance.
      </p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center" :class="stat.iconBg">
            <UIcon :name="stat.icon" class="size-5" :class="stat.iconColor" />
          </div>
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full"
            :class="stat.trendUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'"
          >
            {{ stat.trendUp ? '↑' : '↓' }} {{ stat.trend }}
          </span>
        </div>
        <p class="text-2xl font-bold text-gcg-dark dark:text-white">{{ stat.value }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Server Status Card -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gcg-dark dark:text-white">Server Status</h3>
          <UButton label="View All" variant="link" size="xs" class="text-gcg-accent" />
        </div>
        <div class="space-y-3">
          <div
            v-for="server in servers"
            :key="server.name"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div class="flex items-center gap-3">
              <span class="size-2.5 rounded-full" :class="server.status === 'Online' ? 'bg-green-500' : server.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'" />
              <div>
                <p class="text-sm font-medium text-gcg-dark dark:text-white">{{ server.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ server.ip }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium" :class="server.status === 'Online' ? 'text-green-600 dark:text-green-400' : server.status === 'Warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'">
                {{ server.status }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ server.uptime }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Card -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gcg-dark dark:text-white">Recent Activity</h3>
          <UButton label="See All" variant="link" size="xs" class="text-gcg-accent" />
        </div>
        <div class="space-y-4">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="flex items-start gap-3"
          >
            <div class="size-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" :class="activity.iconBg">
              <UIcon :name="activity.icon" class="size-4" :class="activity.iconColor" />
            </div>
            <div class="min-w-0">
              <p class="text-sm text-gcg-dark dark:text-gray-200">{{ activity.message }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  title: 'IT Admin Dashboard',
})

useHead({
  title: 'IT Admin Dashboard — GCG Monitoring System',
})

// ─── Sample Data ──────────────────────────────────────
const stats = [
  {
    label: 'Total Users',
    value: '2,847',
    icon: 'i-lucide-users',
    iconBg: 'bg-gcg-light dark:bg-gcg-primary/20',
    iconColor: 'text-gcg-primary dark:text-gcg-accent',
    trend: '12.5%',
    trendUp: true,
  },
  {
    label: 'Active Servers',
    value: '24',
    icon: 'i-lucide-server',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    trend: '2.1%',
    trendUp: true,
  },
  {
    label: 'Open Tickets',
    value: '156',
    icon: 'i-lucide-ticket',
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    trend: '8.3%',
    trendUp: false,
  },
  {
    label: 'System Uptime',
    value: '99.97%',
    icon: 'i-lucide-activity',
    iconBg: 'bg-gcg-light dark:bg-gcg-primary/20',
    iconColor: 'text-gcg-primary dark:text-gcg-accent',
    trend: '0.02%',
    trendUp: true,
  },
]

const servers = [
  { name: 'Web Server (Primary)', ip: '192.168.1.10', status: 'Online', uptime: '99.99% — 45d' },
  { name: 'Database Server', ip: '192.168.1.20', status: 'Online', uptime: '99.95% — 30d' },
  { name: 'Mail Server', ip: '192.168.1.30', status: 'Warning', uptime: '98.50% — 12d' },
  { name: 'Backup Server', ip: '192.168.1.40', status: 'Online', uptime: '99.90% — 60d' },
  { name: 'Staging Server', ip: '192.168.1.50', status: 'Offline', uptime: '— maintenance' },
]

const activities = [
  {
    id: 1,
    message: 'New user "john.doe" registered',
    time: '2 minutes ago',
    icon: 'i-lucide-user-plus',
    iconBg: 'bg-gcg-light dark:bg-gcg-primary/20',
    iconColor: 'text-gcg-primary dark:text-gcg-accent',
  },
  {
    id: 2,
    message: 'Server backup completed successfully',
    time: '15 minutes ago',
    icon: 'i-lucide-hard-drive',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 3,
    message: 'SSL certificate renewed for gcg.com',
    time: '1 hour ago',
    icon: 'i-lucide-shield-check',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 4,
    message: 'Mail server alert: high memory usage',
    time: '3 hours ago',
    icon: 'i-lucide-alert-triangle',
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    id: 5,
    message: 'System update v2.4.1 deployed',
    time: '5 hours ago',
    icon: 'i-lucide-rocket',
    iconBg: 'bg-gcg-light dark:bg-gcg-primary/20',
    iconColor: 'text-gcg-primary dark:text-gcg-accent',
  },
]
</script>
