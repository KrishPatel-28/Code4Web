import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [templates, setTemplates] = useState([])
  const [stats, setStats] = useState({ users: 0, templates: 0, purchases: 0 })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'business',
    price: '0',
    preview_image_url: '',
    template_file_url: '',
    tags: '',
    featured: false
  })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      if (activeTab === 'templates') {
        const res = await fetch('/api/templates', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setTemplates(data.templates || [])
        }
      } else if (activeTab === 'overview') {
        const res = await fetch('/api/stats', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats || {})
        }
        const templatesRes = await fetch('/api/templates', { credentials: 'include' })
        if (templatesRes.ok) {
          const templatesData = await templatesRes.json()
          setTemplates(templatesData.templates || [])
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingTemplate 
        ? `/api/templates/${editingTemplate.id}`
        : '/api/templates'
      
      const method = editingTemplate ? 'PUT' : 'POST'
      
      const body = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      
      if (res.ok) {
        setShowModal(false)
        setEditingTemplate(null)
        setFormData({
          title: '',
          description: '',
          category: 'business',
          price: '0',
          preview_image_url: '',
          template_file_url: '',
          tags: '',
          featured: false
        })
        loadData()
      }
    } catch (error) {
      console.error('Error saving template:', error)
    }
  }

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setFormData({
      title: template.title,
      description: template.description || '',
      category: template.category,
      price: template.price.toString(),
      preview_image_url: template.preview_image_url || '',
      template_file_url: template.template_file_url,
      tags: template.tags?.join(', ') || '',
      featured: template.featured || false
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (res.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    navigate('/login')
  }

  const categories = ['business', 'portfolio', 'ecommerce', 'blog', 'landing', 'other']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Code4Web</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'templates'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Templates
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
          {activeTab === 'overview' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                <button
                  onClick={() => {
                    setEditingTemplate(null)
                    setFormData({
                      title: '',
                      description: '',
                      category: 'business',
                      price: '0',
                      preview_image_url: '',
                      template_file_url: '',
                      tags: '',
                      featured: false
                    })
                    setShowModal(true)
                  }}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  + Add Template
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Total Users</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.users}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Total Templates</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.templates}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Total Purchases</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.purchases}</div>
                </div>
              </div>

              {/* Recent Templates */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Templates</h3>
                {loading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : templates.length === 0 ? (
                  <div className="text-gray-500">No templates yet. Create your first template!</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.slice(0, 6).map((template) => (
                      <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {template.preview_image_url && (
                          <img src={template.preview_image_url} alt={template.title} className="w-full h-32 object-cover rounded mb-3" />
                        )}
                        <h4 className="font-semibold text-gray-900">{template.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{template.category}</p>
                        <p className="text-lg font-bold text-gray-900 mt-2">${template.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Template Management</h2>
                <button
                  onClick={() => {
                    setEditingTemplate(null)
                    setFormData({
                      title: '',
                      description: '',
                      category: 'business',
                      price: '0',
                      preview_image_url: '',
                      template_file_url: '',
                      tags: '',
                      featured: false
                    })
                    setShowModal(true)
                  }}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  + Add Template
                </button>
              </div>

              {loading ? (
                <div className="text-gray-500">Loading...</div>
              ) : templates.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 mb-4">No templates yet.</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Create First Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                      {template.preview_image_url ? (
                        <img src={template.preview_image_url} alt={template.title} className="w-full h-48 object-cover" />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No Preview</span>
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
                          {template.featured && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Featured</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{template.category}</span>
                          <span className="text-xl font-bold text-gray-900">${template.price}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(template)}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview Image URL</label>
                <input
                  type="url"
                  value={formData.preview_image_url}
                  onChange={(e) => setFormData({ ...formData, preview_image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template File URL *</label>
                <input
                  type="url"
                  required
                  value={formData.template_file_url}
                  onChange={(e) => setFormData({ ...formData, template_file_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="https://example.com/template.zip"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="modern, responsive, clean"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                  Featured Template
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  {editingTemplate ? 'Update' : 'Create'} Template
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingTemplate(null)
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
