import { verifyJwt } from './_lib/jwt.js'
import { getClient } from './_lib/supabase.js'
import { json, methodNotAllowed, unauthorized, readBody, parseCookie } from './_lib/http.js'

// GET /api/purchases - Get user's purchases
// POST /api/purchases - Purchase a template
export default async function handler(req, res) {
  const cookie = req.headers.cookie || ''
  const token = parseCookie(cookie).token
  if (!token) {
    unauthorized(res)
    return
  }
  
  try {
    const payload = await verifyJwt(token)
    const userId = payload.sub
    
    if (!userId || userId === 'admin') {
      unauthorized(res)
      return
    }
    
    const supabase = getClient()
    
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          template:templates(*)
        `)
        .eq('user_id', userId)
        .order('purchased_at', { ascending: false })
      
      if (error) {
        json(res, 500, { message: error.message })
        return
      }
      
      json(res, 200, { purchases: data || [] })
      return
    }
    
    if (req.method === 'POST') {
      const body = await readBody(req)
      const { template_id } = body
      
      if (!template_id) {
        json(res, 400, { message: 'Template ID required' })
        return
      }
      
      // Check if already purchased
      const { data: existing } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('template_id', template_id)
        .maybeSingle()
      
      if (existing) {
        json(res, 409, { message: 'Template already purchased' })
        return
      }
      
      // Create purchase
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          template_id
        })
        .select(`
          *,
          template:templates(*)
        `)
        .single()
      
      if (error) {
        json(res, 500, { message: error.message })
        return
      }
      
      json(res, 201, { purchase: data })
      return
    }
    
    methodNotAllowed(res)
  } catch (e) {
    unauthorized(res)
  }
}

