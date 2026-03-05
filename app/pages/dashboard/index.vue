<!--
  Dashboard Index — /pages/dashboard/index.vue
  Redirects to IT Admin Dashboard by default.
-->
<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

// Redirect to default dashboard
navigateTo('/dashboard/it-admin', { replace: true })
</script>
