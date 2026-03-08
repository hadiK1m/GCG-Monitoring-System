const PUBLIC_ROUTES = ['/login', '/register']

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checked, fetchUser } = useAuth()

  if (!checked.value) {
    await fetchUser()
  }

  const isPublic = PUBLIC_ROUTES.includes(to.path)
  const isLoadingPage = to.path === '/'

  // Loading page handles its own redirect logic
  if (isLoadingPage) return

  // Authenticated user on login/register → redirect to dashboard
  if (user.value && isPublic) {
    return navigateTo('/dashboard', { replace: true })
  }

  // Unauthenticated user on protected page → redirect to login
  if (!user.value && !isPublic) {
    return navigateTo('/login', { replace: true })
  }
})
