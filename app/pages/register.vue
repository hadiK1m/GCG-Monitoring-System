<!--
  Register Page — /pages/register.vue
  Split layout: AdventureBanner (left) + RegisterForm (right)
  Consistent UI with /pages/login.vue
-->
<template>
  <div class="h-screen overflow-hidden flex flex-col md:flex-row bg-white dark:bg-black">
    <!-- Left Banner — Hidden on mobile, shown on md+ -->
    <div class="w-full md:w-1/2 p-3 md:p-4 hidden md:block">
      <RegisterAdventureBanner />
    </div>

    <!-- Right Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center overflow-y-auto">
      <RegisterForm class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: 'Sign Up — GCG Monitoring System',
})
</script>
