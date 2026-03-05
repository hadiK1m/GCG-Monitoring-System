<!--
  SidebarMenuItem.vue
  Renders a single sidebar menu item with optional children (submenu).
  Supports active state highlighting and collapsible children.
-->
<template>
  <li>
    <!-- Item WITH children (expandable) -->
    <template v-if="item.children && item.children.length">
      <button
        type="button"
        class="
          w-full flex items-center justify-between gap-3
          px-3 py-2.5 rounded-md text-sm font-medium
          transition-colors cursor-pointer
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-800
        "
        :class="isChildActive ? 'bg-gcg-light text-gcg-primary dark:bg-white/5 dark:text-gcg-accent' : ''"
        @click="$emit('toggle')"
      >
        <div class="flex items-center gap-3 min-w-0">
          <UIcon v-if="item.icon" :name="item.icon" class="size-5 shrink-0 text-gcg-primary dark:text-gcg-accent" />
          <span class="truncate">{{ item.label }}</span>
        </div>
        <UIcon
          name="i-lucide-chevron-down"
          class="size-4 shrink-0 transition-transform duration-200 text-gray-400"
          :class="{ 'rotate-180': expanded }"
        />
      </button>

      <!-- Children submenu -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <ul v-show="expanded" class="ml-4 mt-1 space-y-0.5 overflow-hidden border-l border-gray-200 dark:border-gray-800 pl-3">
          <li v-for="child in item.children" :key="child.to">
            <NuxtLink
              :to="child.to || '#'"
              class="
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
                transition-colors
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-800
              "
              :class="
                activeItem === child.to
                  ? 'bg-gcg-light text-gcg-primary dark:bg-white/5 dark:text-gcg-accent border-l-4 border-gcg-primary dark:border-gcg-accent'
                  : 'border-l-4 border-transparent'
              "
              @click="$emit('select', child.to)"
            >
              <UIcon v-if="child.icon" :name="child.icon" class="size-4 shrink-0" :class="activeItem === child.to ? 'text-gcg-primary dark:text-gcg-accent' : 'text-gray-400'" />
              <span v-else class="size-1.5 rounded-full shrink-0" :class="activeItem === child.to ? 'bg-gcg-primary dark:bg-gcg-accent' : 'bg-gray-400'" />
              <span class="truncate">{{ child.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </Transition>
    </template>

    <!-- Item WITHOUT children (direct link) -->
    <template v-else>
      <NuxtLink
        :to="item.to || '#'"
        class="
          flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
          transition-colors
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-800
        "
        :class="
          activeItem === item.to
            ? 'bg-gcg-light text-gcg-primary dark:bg-white/5 dark:text-gcg-accent border-l-4 border-gcg-primary dark:border-gcg-accent'
            : 'border-l-4 border-transparent'
        "
        @click="$emit('select', item.to)"
      >
        <UIcon v-if="item.icon" :name="item.icon" class="size-5 shrink-0" :class="activeItem === item.to ? 'text-gcg-primary dark:text-gcg-accent' : 'text-gray-400'" />
        <span class="truncate">{{ item.label }}</span>
        <span v-if="item.badge" class="ml-auto text-xs px-2 py-0.5 rounded-full" :class="item.badgeColor || 'bg-gcg-accent/10 text-gcg-accent'">
          {{ item.badge }}
        </span>
      </NuxtLink>
    </template>
  </li>
</template>

<script setup lang="ts">
import type { NavItem } from '~/utils/navigation'

const props = defineProps<{
  item: NavItem
  activeItem: string
  expanded?: boolean
  isChildActive?: boolean
}>()

defineEmits<{
  toggle: []
  select: [path: string | undefined]
}>()
</script>
