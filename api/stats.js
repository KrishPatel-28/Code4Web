import { verifyJwt } from './_lib/jwt.js'
import { getClient } from './_lib/supabase.js'
import { json, unauthorized, parseCookie } from './_lib/http.js'

// GET /api/stats - Get admin statistics
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
    if (payload?.role !== 'admin' && payload?.email !== adminEmail) {
      unauthorized(res)
      return
    }
    
    const supabase = getClient()
    
    const [usersResult, templatesResult, purchasesResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('templates').select('id', { count: 'exact', head: true }),
      supabase.from('purchases').select('id', { count: 'exact', head: true })
    ])
    
    json(res, 200, {
      stats: {
        users: usersResult.count || 0,
        templates: templatesResult.count || 0,
        purchases: purchasesResult.count || 0
      }
    })
  } catch (e) {
    unauthorized(res)
  }
}

