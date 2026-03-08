export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) return

  const payload = await verifyAuthToken(token)
  if (payload) {
    event.context.auth = payload
  }
})
