import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function Marketplace() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
    loadTemplates()
  }, [selectedCategory, searchQuery])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const loadTemplates = async () => {
    setLoading(true)
    try {
      let url = '/api/templates?'
      if (selectedCategory !== 'all') {
        url += `category=${selectedCategory}&`
      }
      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`
      }
      const res = await fetch(url, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (templateId) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ template_id: templateId })
      })

      if (res.ok) {
        alert('Template purchased successfully!')
        navigate('/dashboard/purchases')
      } else {
        const data = await res.json()
        alert(data.message || 'Purchase failed')
      }
    } catch (error) {
      console.error('Error purchasing template:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'business', label: 'Business' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'blog', label: 'Blog' },
    { value: 'landing', label: 'Landing Page' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Template Marketplace</h1>
          <p className="text-lg text-gray-600">Browse and purchase professional website templates</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading templates...</div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No templates found</div>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                {template.preview_image_url ? (
                  <div className="relative overflow-hidden">
                    <img
                      src={template.preview_image_url}
                      alt={template.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {template.featured && (
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-yellow-400 text-yellow-900 rounded font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Preview</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{template.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{template.description || 'No description'}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
                      {template.category}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">${template.price}</span>
                  </div>
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => handlePurchase(template.id)}
                    className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                  >
                    Purchase Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

