interface LoginFormState {
  email: string
  password: string
  rememberMe: boolean
}

interface LoginFormErrors {
  email?: string
  password?: string
  general?: string
}

export function useLoginForm() {
  const state = reactive<LoginFormState>({
    email: '',
    password: '',
    rememberMe: false,
  })

  const errors = reactive<LoginFormErrors>({})
  const isLoading = ref(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function validate(): boolean {
    errors.email = undefined
    errors.password = undefined
    errors.general = undefined

    let isValid = true

    if (!state.email.trim()) {
      errors.email = 'Email wajib diisi'
      isValid = false
    } else if (!emailRegex.test(state.email)) {
      errors.email = 'Format email tidak valid'
      isValid = false
    }

    if (!state.password) {
      errors.password = 'Password wajib diisi'
      isValid = false
    } else if (state.password.length < 6) {
      errors.password = 'Password minimal 6 karakter'
      isValid = false
    }

    return isValid
  }

  async function submitForm(): Promise<void> {
    if (!validate()) return

    isLoading.value = true
    errors.general = undefined

    try {
      const { login } = useAuth()
      await login({
        email: state.email,
        password: state.password,
        rememberMe: state.rememberMe,
      })
      await navigateTo('/dashboard')
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      errors.general = error?.data?.message || 'Login gagal. Silakan coba lagi.'
    } finally {
      isLoading.value = false
    }
  }

  async function signInWithGoogle(): Promise<void> {
    console.log('Google Sign-In — belum diimplementasi')
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
