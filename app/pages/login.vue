<!--
  Login Page — /pages/login.vue
  Split layout: AdventureBanner (left) + LoginForm (right)
  Responsive: stacked on mobile, side-by-side on desktop.

  Page metadata:
  - No auth layout (standalone full-screen page)
  - SEO title set for the login page
-->
<template>
  <div class="h-screen overflow-hidden flex flex-col md:flex-row bg-white dark:bg-black">
    <!-- Left Banner — Hidden on mobile, shown on md+ -->
    <div class="w-full md:w-1/2 p-3 md:p-4 hidden md:block">
      <LoginAdventureBanner />
    </div>

    <!-- Right Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center overflow-y-auto">
      <LoginForm class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  layout: false, // Full-screen login page, no default layout
})

useHead({
  title: 'Sign In — GCG Monitoring System',
})
</script>
