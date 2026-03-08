interface RegisterFormState {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

interface RegisterFormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeTerms?: string
  general?: string
}

export function useRegisterForm() {
  const state = reactive<RegisterFormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const errors = reactive<RegisterFormErrors>({})
  const isLoading = ref(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function validate(): boolean {
    errors.fullName = undefined
    errors.email = undefined
    errors.password = undefined
    errors.confirmPassword = undefined
    errors.agreeTerms = undefined
    errors.general = undefined

    let isValid = true

    if (!state.fullName.trim()) {
      errors.fullName = 'Nama lengkap wajib diisi'
      isValid = false
    }

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

    if (!state.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password wajib diisi'
      isValid = false
    } else if (state.confirmPassword !== state.password) {
      errors.confirmPassword = 'Password tidak cocok'
      isValid = false
    }

    if (!state.agreeTerms) {
      errors.agreeTerms = 'Anda harus menyetujui ketentuan layanan'
      isValid = false
    }

    return isValid
  }

  async function submitForm(): Promise<void> {
    if (!validate()) return

    isLoading.value = true
    errors.general = undefined

    try {
      const { register } = useAuth()
      await register({
        fullName: state.fullName,
        email: state.email,
        password: state.password,
      })
      await navigateTo('/login')
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      errors.general = error?.data?.message || 'Registrasi gagal. Silakan coba lagi.'
    } finally {
      isLoading.value = false
    }
  }

  async function signUpWithGoogle(): Promise<void> {
    console.log('Google Sign-Up — belum diimplementasi')
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
