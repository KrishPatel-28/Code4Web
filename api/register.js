import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { getClient } from './_lib/supabase.js'
import { signJwt } from './_lib/jwt.js'
import { setAuthCookie } from './_lib/cookie.js'
import { json, methodNotAllowed, readBody } from './_lib/http.js'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    methodNotAllowed(res)
    return
  }
  try {
    const body = await readBody(req)
    const { email, password } = schema.parse(body)
    const supabase = getClient()
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()
    if (existing) {
      json(res, 409, { message: 'Email already registered' })
      return
    }
    const hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash: hash })
      .select('id, email')
      .single()
    if (error) throw error
    const token = await signJwt({ sub: data.id, email: data.email })
    setAuthCookie(res, token)
    json(res, 200, { id: data.id, email: data.email })
  } catch (e) {
    const status = e.name === 'ZodError' ? 400 : 500
    json(res, status, { message: e.message || 'Internal error' })
  }
}