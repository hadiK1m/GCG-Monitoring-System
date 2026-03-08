export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      avatarUrl: true,
      status: true,
    },
  })

  if (!user || user.status !== 'ACTIVE') {
    deleteCookie(event, 'auth_token', { path: '/' })
    throw createError({ statusCode: 401, message: 'Akun tidak ditemukan atau tidak aktif' })
  }

  return { user }
})
