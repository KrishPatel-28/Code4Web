import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const [authorized, setAuthorized] = useState(null)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' })
        if (res.ok) setAuthorized(true)
        else setAuthorized(false)
      } catch {
        setAuthorized(false)
      }
    }
    check()
  }, [])

  if (authorized === null) return null
  if (!authorized) return <Navigate to="/login" replace />
  return children
}