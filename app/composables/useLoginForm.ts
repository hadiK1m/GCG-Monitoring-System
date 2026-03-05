/**
 * useLoginForm - Composable for login form state and validation
 *
 * Handles:
 * - Form state (email, password, rememberMe)
 * - Validation rules (required fields, email format)
 * - Form submission with placeholder for API integration
 *
 * To integrate with a real backend API:
 * 1. Replace the `submitForm()` placeholder with an actual API call
 * 2. Use `useFetch` or `$fetch` from Nuxt to call your auth endpoint
 * 3. Store the auth token using `useState` or a Pinia store
 *
 * Example with real API:
 * ```ts
 * const { data, error } = await useFetch('/api/auth/login', {
 *   method: 'POST',
 *   body: { email: state.email, password: state.password }
 * })
 * ```
 */

/** Shape of the login form data */
interface LoginFormState {
    email: string
    password: string
    rememberMe: boolean
}

/** Shape of validation errors */
interface LoginFormErrors {
    email?: string
    password?: string
}

export function useLoginForm() {
    // ─── Reactive Form State ───────────────────────────────
    const state = reactive<LoginFormState>({
        email: '',
        password: '',
        rememberMe: false,
    })

    const errors = reactive<LoginFormErrors>({})
    const isLoading = ref(false)

    // ─── Validation Rules ──────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    function validate(): boolean {
        // Reset errors
        errors.email = undefined
        errors.password = undefined

        let isValid = true

        // Email validation
        if (!state.email.trim()) {
            errors.email = 'Email is required'
            isValid = false
        } else if (!emailRegex.test(state.email)) {
            errors.email = 'Please enter a valid email address'
            isValid = false
        }

        // Password validation
        if (!state.password) {
            errors.password = 'Password is required'
            isValid = false
        } else if (state.password.length < 6) {
            errors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        return isValid
    }

    // ─── Form Submission ───────────────────────────────────
    /**
     * Submit the login form.
     * Replace this placeholder with your actual authentication logic.
     */
    async function submitForm(): Promise<void> {
        if (!validate()) return

        isLoading.value = true

        try {
            // TODO: Replace with actual API call
            // Example:
            // const { data } = await $fetch('/api/auth/login', {
            //   method: 'POST',
            //   body: { email: state.email, password: state.password },
            // })

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1500))

            console.log('Login submitted:', {
                email: state.email,
                rememberMe: state.rememberMe,
            })

            // TODO: Handle successful login
            // - Store token in cookie/localStorage
            // - Redirect to dashboard: navigateTo('/dashboard')
            navigateTo('/') // Redirect after login
        } catch (error) {
            console.error('Login failed:', error)
            // TODO: Show error toast/notification to user
        } finally {
            isLoading.value = false
        }
    }

    // ─── Google OAuth Placeholder ──────────────────────────
    /**
     * Sign in with Google.
     * To implement Google OAuth:
     * 1. Install `nuxt-auth-utils` or use Google Identity Services
     * 2. Configure OAuth credentials in Google Cloud Console
     * 3. Call your OAuth endpoint here
     */
    async function signInWithGoogle(): Promise<void> {
        console.log('Google Sign-In triggered — implement OAuth here')
        // TODO: Implement Google OAuth flow
        // Example with nuxt-auth-utils:
        // await loginWith('google')
    }

    return {
        state,
        errors,
        isLoading,
        validate,
        submitForm,
        signInWithGoogle,
    }
}
