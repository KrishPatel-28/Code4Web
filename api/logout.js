import { clearAuthCookie } from './_lib/cookie.js'
import { json, methodNotAllowed } from './_lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    methodNotAllowed(res)
    return
  }
  clearAuthCookie(res)
  json(res, 200, { ok: true })
}