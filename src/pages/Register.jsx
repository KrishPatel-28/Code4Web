import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: form.email, password: form.password })
    })
    if (res.ok) navigate('/dashboard')
    else {
      const data = await res.json().catch(() => ({ message: 'Error' }))
      setError(data.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Create your Code4Web account</h2>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input type="email" placeholder="you@example.com" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.078.33-2.136.946-3.108m3.265-2.83A9.97 9.97 0 0112 5c5 0 9 4 9 7 0 1.16-.353 2.27-1.003 3.266M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                )}
              </button>
            </div>
            <div className="mt-1 text-xs text-gray-500">Min 8 characters</div>
          </div>
          <div>
            <label className="text-sm text-gray-700">Confirm password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} placeholder="••••••••" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
              <button type="button" aria-label="Toggle confirm visibility" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                {showConfirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.078.33-2.136.946-3.108m3.265-2.83A9.97 9.97 0 0112 5c5 0 9 4 9 7 0 1.16-.353 2.27-1.003 3.266M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                )}
              </button>
            </div>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-black text-white py-2 disabled:opacity-70">{loading ? 'Creating...' : 'Sign up'}</button>
        </form>
        <div className="mt-4 text-sm">Already have an account? <Link to="/login" className="underline">Log in</Link></div>
      </div>
    </div>
  )
}