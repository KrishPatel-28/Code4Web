import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [purchases, setPurchases] = useState([])

  useEffect(() => {
    loadUser()
    loadPurchases()
  }, [])

  const loadUser = async () => {
    try {
      const res = await fetch('/api/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const loadPurchases = async () => {
    try {
      const res = await fetch('/api/purchases', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setPurchases(data.purchases || [])
      }
    } catch (error) {
      console.error('Error loading purchases:', error)
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
              className="w-full text-left px-4 py-3 rounded-lg bg-black text-white"
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
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
            <h1 className="text-3xl font-bold text-gray-900">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
            <p className="text-gray-600 mt-2">Manage your templates and purchases</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Purchases</div>
              <div className="text-3xl font-bold text-gray-900">{purchases.length}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Available Templates</div>
              <div className="text-3xl font-bold text-gray-900">Browse Marketplace</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Quick Actions</div>
              <button
                onClick={() => navigate('/marketplace')}
                className="mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
              >
                Browse Templates
              </button>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Purchases</h2>
              {purchases.length > 0 && (
                <button
                  onClick={() => navigate('/dashboard/purchases')}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  View All →
                </button>
              )}
            </div>
            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't purchased any templates yet</p>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchases.slice(0, 3).map((purchase) => {
                  const template = purchase.template
                  if (!template) return null
                  
                  return (
                    <div key={purchase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {template.preview_image_url && (
                        <img src={template.preview_image_url} alt={template.title} className="w-full h-32 object-cover rounded mb-3" />
                      )}
                      <h4 className="font-semibold text-gray-900">{template.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.category}</p>
                      <a
                        href={template.template_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm text-black hover:underline font-medium"
                      >
                        Download →
                      </a>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}