<!--
  RegisterForm.vue
  Right-side register form with full name, email, password, confirm password,
  terms agreement, Google sign-up, and sign-in link.
  Consistent UI with LoginForm.vue.
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
    aria-label="Register form"
  >
    <div class="w-full max-w-md mx-auto my-auto">
      <!-- Header -->
      <header class="mb-5">
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          CREATE ACCOUNT
        </h2>
        <p class="text-gray-500 text-sm">
          Start your adventure! Fill in your details below.
        </p>
      </header>

      <!-- Register Form -->
      <form
        @submit.prevent="submitForm"
        class="space-y-4"
        novalidate
      >
        <!-- Full Name Field -->
        <UFormField label="Full Name" :error="errors.fullName">
          <UInput
            v-model="state.fullName"
            type="text"
            placeholder="Enter your full name"
            icon="i-lucide-user"
            size="lg"
            class="w-full"
            autocomplete="name"
            aria-label="Full name"
          />
        </UFormField>

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
            autocomplete="new-password"
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

        <!-- Confirm Password Field -->
        <UFormField label="Confirm Password" :error="errors.confirmPassword">
          <UInput
            v-model="state.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="••••••••"
            icon="i-lucide-lock"
            size="lg"
            class="w-full"
            autocomplete="new-password"
            aria-label="Confirm password"
            :ui="{ trailing: 'pointer-events-auto' }"
          >
            <template #trailing>
              <UButton
                :icon="showConfirmPassword ? 'i-lucide-eye' : 'i-lucide-eye-off'"
                variant="link"
                color="neutral"
                size="sm"
                :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- Agree Terms -->
        <div class="flex items-start">
          <UCheckbox
            v-model="state.agreeTerms"
            color="primary"
          >
            <template #label>
              <span class="text-sm">
                I agree to the
                <NuxtLink to="/terms" class="font-semibold text-gcg-dark hover:text-gcg-accent transition-colors">
                  Terms of Service
                </NuxtLink>
                and
                <NuxtLink to="/privacy" class="font-semibold text-gcg-dark hover:text-gcg-accent transition-colors">
                  Privacy Policy
                </NuxtLink>
              </span>
            </template>
          </UCheckbox>
        </div>
        <p v-if="errors.agreeTerms" class="text-red-500 text-xs -mt-2">{{ errors.agreeTerms }}</p>

        <!-- Sign Up Button -->
        <UButton
          type="submit"
          label="Sign up"
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

      <!-- Google Sign Up -->
      <UButton
        label="Sign up with Google"
        icon="i-simple-icons-google"
        variant="outline"
        color="neutral"
        size="lg"
        block
        class="font-semibold cursor-pointer mt-4"
        @click="signUpWithGoogle"
      />

      <!-- Sign In Link -->
      <p class="mt-5 text-center text-sm text-gray-500">
        Already have an account?
        <NuxtLink
          to="/login"
          class="font-semibold text-gcg-primary hover:text-gcg-primary-dark transition-colors"
        >
          Sign in
        </NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { state, errors, isLoading, submitForm, signUpWithGoogle } = useRegisterForm()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
</script>
