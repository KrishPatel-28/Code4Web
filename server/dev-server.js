import 'dotenv/config'
import http from 'http'
import register from '../api/register.js'
import login from '../api/login.js'
import me from '../api/me.js'
import logout from '../api/logout.js'
import templates from '../api/templates.js'
import templateById from '../api/templates/[id].js'
import purchases from '../api/purchases.js'
import stats from '../api/stats.js'

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }
  
  // Parse URL to handle query parameters
  const urlPath = req.url.split('?')[0]
  
  // Log requests for debugging
  console.log(`${req.method} ${urlPath}`)
  
  // Health check
  if (urlPath === '/api/health') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true }))
    return
  }
  
  // Route handlers - exact matches first
  if (urlPath === '/api/register') return register(req, res)
  if (urlPath === '/api/login') return login(req, res)
  if (urlPath === '/api/me') return me(req, res)
  if (urlPath === '/api/logout') return logout(req, res)
  if (urlPath === '/api/stats') return stats(req, res)
  if (urlPath === '/api/purchases') return purchases(req, res)
  if (urlPath === '/api/templates') return templates(req, res)
  
  // Templates routes with ID (must come after exact /api/templates match)
  if (urlPath.startsWith('/api/templates/')) {
    const id = urlPath.split('/').pop()
    if (id && id !== 'templates') {
      return templateById(req, res)
    }
  }
  
  console.log(`404: ${req.method} ${urlPath}`)
  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ error: 'Not found', path: urlPath }))
})

server.listen(3000, () => {
  console.log('API server running on http://localhost:3000')
})