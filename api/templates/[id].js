import { verifyJwt } from '../_lib/jwt.js'
import { getClient } from '../_lib/supabase.js'
import { json, methodNotAllowed, unauthorized, readBody, parseCookie } from '../_lib/http.js'

// GET /api/templates/:id - Get single template
// PUT /api/templates/:id - Update template (admin only)
// DELETE /api/templates/:id - Delete template (admin only)
export default async function handler(req, res) {
  // Extract ID from URL path like /api/templates/123-456-789
  const pathParts = req.url.split('/').filter(Boolean)
  const idIndex = pathParts.indexOf('templates')
  const id = idIndex >= 0 && pathParts[idIndex + 1] ? pathParts[idIndex + 1] : null
  
  if (!id || id === 'templates') {
    json(res, 400, { message: 'Template ID required' })
    return
  }
  
  const supabase = getClient()
  
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) {
      json(res, 404, { message: 'Template not found' })
      return
    }
    
    json(res, 200, { template: data })
    return
  }
  
  if (req.method === 'PUT' || req.method === 'DELETE') {
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
      
      if (req.method === 'DELETE') {
        const { error } = await supabase
          .from('templates')
          .delete()
          .eq('id', id)
        
        if (error) {
          json(res, 500, { message: error.message })
          return
        }
        
        json(res, 200, { message: 'Template deleted' })
        return
      }
      
      // PUT - Update template
      const body = await readBody(req)
      const { data, error } = await supabase
        .from('templates')
        .update({
          ...body,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        json(res, 500, { message: error.message })
        return
      }
      
      json(res, 200, { template: data })
    } catch (e) {
      unauthorized(res)
    }
    return
  }
  
  methodNotAllowed(res)
}

