export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production'
  const cookie = [
    `token=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    isProd ? 'Secure' : '',
    'Max-Age=604800'
  ].filter(Boolean).join('; ')
  res.setHeader('Set-Cookie', cookie)
}

export function clearAuthCookie(res) {
  const cookie = [
    'token=;',
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0'
  ].join('; ')
  res.setHeader('Set-Cookie', cookie)
}