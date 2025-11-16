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

    // Standard user login - use limit(1) instead of maybeSingle() to avoid coercion errors
    const { data: users, error: supabaseError } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', email)
      .limit(1)
    
    // Check for Supabase errors first
    if (supabaseError) {
      // Check error code, message, or details for "coerce" related errors
      const errorCode = supabaseError.code || ''
      const errorMessage = supabaseError.message || ''
      const errorDetails = supabaseError.details || ''
      const errorHint = supabaseError.hint || ''
      const fullError = `${errorCode} ${errorMessage} ${errorDetails} ${errorHint}`.toLowerCase()
      
      // If it's a coercion error or any database error, treat as user not found
      if (fullError.includes('coerce') || fullError.includes('single') || fullError.includes('json') || errorCode === 'PGRST116') {
        json(res, 401, { message: 'User not exist' })
        return
      }
      // Other database errors - treat as user not found for security
      console.error('Database error:', supabaseError)
      json(res, 401, { message: 'User not exist' })
      return
    }
    
    // Check if user exists (no users found or empty array)
    if (!users || users.length === 0 || !users[0]) {
      json(res, 401, { message: 'User not exist' })
      return
    }
    
    const user = users[0]
    
    // Verify password
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      json(res, 401, { message: 'Invalid email or password' })
      return
    }
    
    const token = await signJwt({ sub: user.id, email: user.email })
    setAuthCookie(res, token)
    json(res, 200, { id: user.id, email: user.email })
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
    // Handle Supabase "Cannot coerce" error (user not found)
    const errorMsg = e?.message || String(e || '')
    const errorCode = e?.code || ''
    if (errorMsg.includes('coerce') || errorMsg.includes('single') || errorMsg.includes('JSON') || errorCode === 'PGRST116') {
      json(res, 401, { message: 'User not exist' })
      return
    }
    // Handle other errors
    console.error('Login error:', e)
    json(res, 500, { message: 'An error occurred. Please try again later.' })
  }
}