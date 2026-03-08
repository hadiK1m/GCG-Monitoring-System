import { SignJWT, jwtVerify } from 'jose'
import type { H3Event } from 'h3'

interface AuthPayload {
  userId: string
  email: string
  role: string
}

const getSecret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-dev-secret')

export async function signAuthToken(
  payload: AuthPayload,
  expiresIn = '7d',
): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret())
}

export async function verifyAuthToken(
  token: string,
): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as AuthPayload
  } catch {
    return null
  }
}

export function requireAuth(event: H3Event): AuthPayload {
  const auth = event.context.auth as AuthPayload | undefined
  if (!auth) {
    throw createError({ statusCode: 401, message: 'Authentication required' })
  }
  return auth
}
