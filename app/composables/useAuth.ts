interface AuthUser {
  id: string
  fullName: string
  email: string
  role: string
  avatarUrl: string | null
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth_user', () => null)
  const checked = useState<boolean>('auth_checked', () => false)

  async function fetchUser(): Promise<void> {
    if (checked.value && user.value) return
    try {
      const headers = import.meta.server
        ? useRequestHeaders(['cookie'])
        : undefined
      const data = await $fetch('/api/auth/me', { headers })
      user.value = data.user as AuthUser
    } catch {
      user.value = null
    }
    checked.value = true
  }

  async function login(credentials: {
    email: string
    password: string
    rememberMe: boolean
  }): Promise<AuthUser> {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })
    user.value = data.user as AuthUser
    checked.value = true
    return data.user as AuthUser
  }

  async function register(data: {
    fullName: string
    email: string
    password: string
  }): Promise<void> {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: data,
    })
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    checked.value = false
    await navigateTo('/login')
  }

  const isAuthenticated = computed(() => !!user.value)

  return { user, isAuthenticated, checked, fetchUser, login, register, logout }
}
