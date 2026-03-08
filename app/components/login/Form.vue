<!--
  LoginForm.vue
  Right-side login form with email/password fields,
  remember me, forgot password, Google sign-in, and sign-up link.
  Uses Nuxt UI components for consistent styling.
-->
<template>
  <section
    class="
      min-h-screen w-full
      flex flex-col justify-center
      px-4 py-0
      md:px-16 md:py-0
      lg:px-24
    "
    aria-label="Login form"
  >
    <div class="w-full max-w-md mx-auto my-auto">
      <!-- Header -->
      <header class="mb-5">
        <h2 class="text-2xl md:text-3xl font-extrabold text-gcg-dark mb-2">
          WELCOME BACK !
        </h2>
        <p class="text-gray-500 text-sm">
          Welcome back! Please enter your details.
        </p>
      </header>

      <!-- Login Form -->
      <form
        @submit.prevent="submitForm"
        class="space-y-4"
        novalidate
      >
        <!-- Email Field -->
        <UFormField label="Email" :error="errors.email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="Enter your email"
            icon="i-lucide-mail"
            size="lg"
            class="w-full"
            autocomplete="email"
            aria-label="Email address"
          />
        </UFormField>

        <!-- Password Field -->
        <UFormField label="Password" :error="errors.password">
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            icon="i-lucide-lock"
            size="lg"
            class="w-full"
            autocomplete="current-password"
            aria-label="Password"
            :ui="{ trailing: 'pointer-events-auto' }"
          >
            <template #trailing>
              <UButton
                :icon="showPassword ? 'i-lucide-eye' : 'i-lucide-eye-off'"
                variant="link"
                color="neutral"
                size="sm"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- Remember Me -->
        <div class="flex items-center">
          <UCheckbox
            v-model="state.rememberMe"
            label="Remember me"
            color="primary"
          />
        </div>

        <!-- General Error -->
        <div
          v-if="errors.general"
          class="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          <UIcon name="i-lucide-alert-circle" class="size-4 shrink-0" />
          <span>{{ errors.general }}</span>
        </div>

        <!-- Sign In Button -->
        <UButton
          type="submit"
          label="Sign in"
          size="lg"
          block
          :loading="isLoading"
          class="bg-gcg-primary hover:bg-gcg-primary-dark text-white font-semibold cursor-pointer"
        />
      </form>

      <!-- Divider -->
      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gcg-neutral" />
        </div>
      </div>

      <!-- Google Sign In -->
      <UButton
        label="Sign in with Google"
        icon="i-simple-icons-google"
        variant="outline"
        color="neutral"
        size="lg"
        block
        class="font-semibold cursor-pointer mt-4"
        @click="signInWithGoogle"
      />

      <!-- Sign Up Link -->
      <p class="mt-5 text-center text-sm text-gray-500">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="font-semibold text-gcg-primary hover:text-gcg-primary-dark transition-colors"
        >
          Sign up
        </NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { state, errors, isLoading, submitForm, signInWithGoogle } = useLoginForm()
const showPassword = ref(false)
</script>