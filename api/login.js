import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { getClient } from './_lib/supabase.js'
import { signJwt } from './_lib/jwt.js'
import { setAuthCookie } from './_lib/cookie.js'
import { json, methodNotAllowed, readBody } from './_lib/http.js'

const schema = z.object({ email: z.string().email(), password: z.string().min(8) })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    methodNotAllowed(res)
    return
  }
  try {
    const body = await readBody(req)
    const { email, password } = schema.parse(body)
    const supabase = getClient()

    // Admin shortcut: allow default admin credentials without DB dependency
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@code4web.com'
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123'
    if (email === adminEmail && password === adminPass) {
      const token = await signJwt({ sub: 'admin', email, role: 'admin' })
      setAuthCookie(res, token)
      json(res, 200, { id: 'admin', email, role: 'admin' })
      return
    }

    // Standard user login
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single()
    if (error) throw error
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      json(res, 401, { message: 'Invalid credentials' })
      return
    }
    const token = await signJwt({ sub: user.id, email: user.email })
    setAuthCookie(res, token)
    json(res, 200, { id: user.id, email: user.email })
  } catch (e) {
    const status = e.name === 'ZodError' ? 400 : 500
    json(res, status, { message: e.message || 'Internal error' })
  }
}