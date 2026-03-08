<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gcg-dark via-gcg-primary to-gcg-primary-dark overflow-hidden">
    <!-- Ambient glow -->
    <div class="absolute w-[500px] h-[500px] rounded-full bg-gcg-accent/10 blur-[120px] pointer-events-none" />

    <!-- Branding -->
    <div class="relative z-10 flex flex-col items-center gap-6">
      <!-- Icon mark -->
      <div
        class="size-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center animate-fade-in"
      >
        <UIcon name="i-lucide-shield-check" class="size-10 text-gcg-accent" />
      </div>

      <!-- Title -->
      <div class="text-center animate-fade-in-delayed">
        <h1 class="text-4xl font-bold text-white tracking-tight">GCG</h1>
        <p class="text-sm text-gcg-accent/80 tracking-widest uppercase mt-1">Monitoring System</p>
      </div>

      <!-- Loading indicator -->
      <div class="mt-8 flex flex-col items-center gap-4 animate-fade-in-delayed-2">
        <div class="relative w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div class="absolute inset-y-0 left-0 bg-gcg-accent rounded-full animate-loading-bar" />
        </div>
        <p class="text-xs text-white/50">Memuat sistem…</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: 'GCG Monitoring System',
})

const { fetchUser, isAuthenticated } = useAuth()

onMounted(async () => {
  await fetchUser()

  setTimeout(() => {
    if (isAuthenticated.value) {
      navigateTo('/dashboard', { replace: true })
    } else {
      navigateTo('/login', { replace: true })
    }
  }, 1800)
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out both;
}
.animate-fade-in-delayed {
  animation: fadeIn 0.6s ease-out 0.3s both;
}
.animate-fade-in-delayed-2 {
  animation: fadeIn 0.6s ease-out 0.6s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-loading-bar {
  animation: loadingBar 1.5s ease-in-out 0.6s both;
}

@keyframes loadingBar {
  0% {
    width: 0%;
  }
  60% {
    width: 70%;
  }
  100% {
    width: 100%;
  }
}
</style>
