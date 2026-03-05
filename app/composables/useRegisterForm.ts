/**
 * useRegisterForm - Composable for register form state and validation
 *
 * Handles:
 * - Form state (fullName, email, password, confirmPassword, agreeTerms)
 * - Validation rules (required fields, email format, password match)
 * - Form submission with placeholder for API integration
 *
 * To integrate with a real backend API:
 * 1. Replace the `submitForm()` placeholder with an actual API call
 * 2. Use `useFetch` or `$fetch` from Nuxt to call your auth endpoint
 * 3. Redirect to login or dashboard after successful registration
 */

/** Shape of the register form data */
interface RegisterFormState {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    agreeTerms: boolean
}

/** Shape of validation errors */
interface RegisterFormErrors {
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    agreeTerms?: string
}

export function useRegisterForm() {
    // ─── Reactive Form State ───────────────────────────────
    const state = reactive<RegisterFormState>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    })

    const errors = reactive<RegisterFormErrors>({})
    const isLoading = ref(false)

    // ─── Validation Rules ──────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    function validate(): boolean {
        errors.fullName = undefined
        errors.email = undefined
        errors.password = undefined
        errors.confirmPassword = undefined
        errors.agreeTerms = undefined

        let isValid = true

        // Full name validation
        if (!state.fullName.trim()) {
            errors.fullName = 'Full name is required'
            isValid = false
        }

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

        // Confirm password validation
        if (!state.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password'
            isValid = false
        } else if (state.confirmPassword !== state.password) {
            errors.confirmPassword = 'Passwords do not match'
            isValid = false
        }

        // Terms agreement
        if (!state.agreeTerms) {
            errors.agreeTerms = 'You must agree to the terms'
            isValid = false
        }

        return isValid
    }

    // ─── Form Submission ───────────────────────────────────
    async function submitForm(): Promise<void> {
        if (!validate()) return

        isLoading.value = true

        try {
            // TODO: Replace with actual API call
            // const { data } = await $fetch('/api/auth/register', {
            //   method: 'POST',
            //   body: {
            //     fullName: state.fullName,
            //     email: state.email,
            //     password: state.password,
            //   },
            // })

            await new Promise((resolve) => setTimeout(resolve, 1500))

            console.log('Register submitted:', {
                fullName: state.fullName,
                email: state.email,
            })

            navigateTo('/login')
        } catch (error) {
            console.error('Registration failed:', error)
        } finally {
            isLoading.value = false
        }
    }

    // ─── Google OAuth Placeholder ──────────────────────────
    async function signUpWithGoogle(): Promise<void> {
        console.log('Google Sign-Up triggered — implement OAuth here')
    }

    return {
        state,
        errors,
        isLoading,
        validate,
        submitForm,
        signUpWithGoogle,
    }
}
