import { verifyJwt } from './_lib/jwt.js'
import { getClient } from './_lib/supabase.js'
import { json, methodNotAllowed, unauthorized, readBody, parseCookie } from './_lib/http.js'

// GET /api/templates - List all templates (public)
// POST /api/templates - Create template (admin only)
export default async function handler(req, res) {
  const supabase = getClient()
  
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, 'http://localhost')
      const category = url.searchParams.get('category')
      const featured = url.searchParams.get('featured')
      const search = url.searchParams.get('search')
      
      let query = supabase.from('templates').select('*').order('created_at', { ascending: false })
      
      if (category && category !== 'all') query = query.eq('category', category)
      if (featured === 'true') query = query.eq('featured', true)
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      
      const { data, error } = await query
      if (error) {
        json(res, 500, { message: error.message })
        return
      }
      json(res, 200, { templates: data || [] })
    } catch (e) {
      json(res, 500, { message: 'Error parsing request' })
    }
    return
  }
  
  if (req.method === 'POST') {
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
      
      const body = await readBody(req)
      const { title, description, category, price, preview_image_url, template_file_url, tags, featured } = body
      
      if (!title || !category || !template_file_url) {
        json(res, 400, { message: 'Missing required fields' })
        return
      }
      
      const { data, error } = await supabase
        .from('templates')
        .insert({
          title,
          description: description || '',
          category,
          price: parseFloat(price) || 0,
          preview_image_url: preview_image_url || '',
          template_file_url,
          tags: tags || [],
          featured: featured || false,
          created_by: payload.sub
        })
        .select()
        .single()
      
      if (error) {
        json(res, 500, { message: error.message })
        return
      }
      
      json(res, 201, { template: data })
    } catch (e) {
      unauthorized(res)
    }
    return
  }
  
  methodNotAllowed(res)
}

