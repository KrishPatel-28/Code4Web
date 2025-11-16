import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      // Not logged in
    }
  }

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    navigate('/')
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/')} className="text-2xl font-bold text-gray-900 hover:text-black transition-colors">
            Code4Web
          </button>
          <nav className="hidden md:flex gap-6 text-sm text-gray-700">
            <Link to="/marketplace" className="hover:text-black transition-colors font-medium">Marketplace</Link>
            <Link to="/" className="hover:text-black transition-colors">About</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium">
                  Admin
                </Link>
              ) : (
                <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium">
                  Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors font-medium">
                Log in
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-900 transition-colors font-medium">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}