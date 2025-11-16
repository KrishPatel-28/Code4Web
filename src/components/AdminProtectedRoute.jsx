import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function AdminProtectedRoute({ children }) {
  const [state, setState] = useState({ checked: false, isAdmin: false })

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' })
        if (!res.ok) { setState({ checked: true, isAdmin: false }); return }
        const data = await res.json()
        const role = data?.user?.role
        setState({ checked: true, isAdmin: role === 'admin' })
      } catch {
        setState({ checked: true, isAdmin: false })
      }
    }
    check()
  }, [])

  if (!state.checked) return null
  if (!state.isAdmin) return <Navigate to="/dashboard" replace />
  return children
}