import bcryptjs from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    fullName?: string
    email?: string
    password?: string
  }>(event)

  const { fullName, email, password } = body || {}

  if (!fullName?.trim() || !email?.trim() || !password) {
    throw createError({ statusCode: 400, message: 'Semua field wajib diisi' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password minimal 6 karakter' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Email sudah terdaftar' })
  }

  const passwordHash = await bcryptjs.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    },
    select: { id: true, email: true, fullName: true, role: true },
  })

  return { success: true, user }
})
