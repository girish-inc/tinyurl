import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Regex to match short link codes (6-8 alphanumeric characters)
const codeRegex = /^[A-Za-z0-9]{6,8}$/

export default function ShortLinkRedirect() {
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect if it matches the short code pattern
    if (!code || !codeRegex.test(code)) {
      // If it doesn't match, redirect to home
      navigate('/', { replace: true })
      return
    }

    // Redirect to the backend server for short link resolution
    // If VITE_API_URL is set (separate backend), use it; otherwise use same origin
    const apiBaseUrl = import.meta.env.VITE_API_URL || ''
    const serverUrl = import.meta.env.DEV 
      ? `http://localhost:4000/${code}`
      : apiBaseUrl 
        ? `${apiBaseUrl}/${code}` // Separate backend (e.g., Render)
        : `/${code}` // Same origin (monolithic deployment)
    
    window.location.href = serverUrl
  }, [code, navigate])

  return null
}
