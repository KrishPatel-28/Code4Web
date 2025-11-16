import { verifyJwt } from './_lib/jwt.js'
import { getClient } from './_lib/supabase.js'
import { json, unauthorized, parseCookie } from './_lib/http.js'

export default async function handler(req, res) {
  const cookie = req.headers.cookie || ''
  const token = parseCookie(cookie).token
  if (!token) {
    unauthorized(res)
    return
  }
  try {
    const payload = await verifyJwt(token)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@code4web.com'
    if (payload?.role === 'admin' || payload?.email === adminEmail) {
      json(res, 200, { user: { id: payload.sub || 'admin', email: payload.email, role: 'admin' } })
      return
    }
    const supabase = getClient()
    const { data: user } = await supabase.from('users').select('id, email, role').eq('id', payload.sub).maybeSingle()
    if (!user) {
      unauthorized(res)
      return
    }
    json(res, 200, { user })
  } catch {
    unauthorized(res)
  }
}