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
    // Handle validation errors
    if (e.name === 'ZodError') {
      const errors = e.errors.map(err => {
        if (err.path[0] === 'email') return 'Please enter a valid email address'
        if (err.path[0] === 'password') return 'Password must be at least 8 characters long'
        return err.message
      })
      json(res, 400, { message: errors[0] || 'Invalid input' })
      return
    }
    // Handle database errors
    if (e.code === '23505') { // PostgreSQL unique violation
      json(res, 409, { message: 'This email is already registered' })
      return
    }
    // Handle other errors
    console.error('Registration error:', e)
    json(res, 500, { message: 'An error occurred during registration. Please try again later.' })
  }
}