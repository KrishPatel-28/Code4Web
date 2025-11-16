import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      
      if (res.ok) {
        try {
          const me = await fetch('/api/me', { credentials: 'include' })
          if (me.ok) {
            const data = await me.json()
            const role = data?.user?.role
            navigate(role === 'admin' ? '/admin' : '/dashboard')
          } else {
            navigate('/dashboard')
          }
        } catch {
          navigate('/dashboard')
        }
      } else {
        // Try to parse error message from response
        let errorMessage = 'Login failed. Please check your credentials and try again.'
        try {
          const contentType = res.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json()
            errorMessage = data.message || errorMessage
          } else {
            const text = await res.text()
            if (text) errorMessage = text
          }
        } catch (parseError) {
          // If parsing fails, use default message
          console.error('Error parsing response:', parseError)
        }
        setError(errorMessage)
      }
    } catch (networkError) {
      setError('Network error. Please check your connection and try again.')
      console.error('Network error:', networkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
        <div className="mb-6">
          <div className="text-sm text-gray-500 font-medium">Code4Web</div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">Log in to continue building your site.</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input type="email" placeholder="you@example.com" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} placeholder="••••••••" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">{show ? 'Hide' : 'Show'}</button>
            </div>
            <div className="mt-2 text-xs text-gray-500"><Link to="#" className="underline">Forgot password?</Link></div>
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition disabled:opacity-70">{loading ? 'Signing in...' : 'Log in'}</button>
        </form>
        <div className="mt-6 text-sm text-gray-700">No account? <Link to="/register" className="underline">Create one</Link></div>
      </div>
    </div>
  )
}