import bcryptjs from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email?: string
    password?: string
    rememberMe?: boolean
  }>(event)

  const { email, password, rememberMe } = body || {}

  if (!email?.trim() || !password) {
    throw createError({ statusCode: 400, message: 'Email dan password wajib diisi' })
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  })

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const userAgent = getHeader(event, 'user-agent') || null

  if (!user) {
    throw createError({ statusCode: 401, message: 'Email atau password salah' })
  }

  if (user.status !== 'ACTIVE') {
    throw createError({ statusCode: 403, message: 'Akun tidak aktif atau dibekukan' })
  }

  const valid = await bcryptjs.compare(password, user.passwordHash)

  if (!valid) {
    await prisma.loginLog.create({
      data: { userId: user.id, ipAddress: ip, userAgent, status: 'FAILED' },
    })
    throw createError({ statusCode: 401, message: 'Email atau password salah' })
  }

  // Log success + update last login
  await Promise.all([
    prisma.loginLog.create({
      data: { userId: user.id, ipAddress: ip, userAgent, status: 'SUCCESS' },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: ip },
    }),
  ])

  const expiresIn = rememberMe ? '30d' : '7d'
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60

  const token = await signAuthToken(
    { userId: user.id, email: user.email, role: user.role },
    expiresIn,
  )

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/',
  })

  return {
    success: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  }
})
