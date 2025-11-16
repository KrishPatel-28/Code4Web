export function json(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export function methodNotAllowed(res) {
  json(res, 405, { message: 'Method not allowed' })
}

export function unauthorized(res) {
  json(res, 401, { message: 'Unauthorized' })
}

export function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => { data += c })
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

export function parseCookie(str = '') {
  return Object.fromEntries(
    str.split(';').map(s => s.trim()).filter(Boolean).map(s => {
      const idx = s.indexOf('=')
      return [s.slice(0, idx), decodeURIComponent(s.slice(idx + 1))]
    })
  )
}