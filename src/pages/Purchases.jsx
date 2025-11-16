import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Purchases() {
  const navigate = useNavigate()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPurchases()
  }, [])

  const loadPurchases = async () => {
    try {
      const res = await fetch('/api/purchases', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setPurchases(data.purchases || [])
      } else if (res.status === 401) {
        navigate('/login')
      }
    } catch (error) {
      console.error('Error loading purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Code4Web</h1>
            <p className="text-sm text-gray-500 mt-1">My Account</p>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Marketplace
            </button>
            <button
              onClick={() => navigate('/dashboard/purchases')}
              className="w-full text-left px-4 py-3 rounded-lg bg-black text-white"
            >
              My Purchases
            </button>
          </nav>
          <button
            onClick={logout}
            className="mt-8 w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Log out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">My Purchases</h2>
            <p className="text-gray-600 mt-2">View and download your purchased templates</p>
          </div>

          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : purchases.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No purchases yet</h3>
              <p className="text-gray-600 mb-6">Browse our marketplace to find templates you love</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => {
                const template = purchase.template
                if (!template) return null
                
                return (
                  <div
                    key={purchase.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {template.preview_image_url ? (
                      <img
                        src={template.preview_image_url}
                        alt={template.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Preview</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description || 'No description'}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {template.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          Purchased {new Date(purchase.purchased_at).toLocaleDateString()}
                        </span>
                      </div>
                      <a
                        href={template.template_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block text-center px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                      >
                        Download Template
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

