// Tiny wrapper around fetch with correct base URL
// Supports VITE_API_URL env var for separate backend deployment (e.g., Render)
// Falls back to localhost in dev, empty string (same origin) in production

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.DEV ? 'http://localhost:4000' : '')

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    let message = `HTTP error! status: ${response.status}`
    try {
      const errorData = await response.json()
      message = errorData.message || errorData.error || message
    } catch {
      // If response is not JSON, use default message
    }
    
    const error = new Error(message)
    error.status = response.status
    error.response = response
    throw error
  }

  // Handle 204 No Content responses (common for DELETE operations)
  if (response.status === 204 || response.statusText === 'No Content') {
    return null
  }

  // Check if response has content before parsing JSON
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return null
  }

  // Try to parse JSON, but handle empty responses gracefully
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function fetchLinks() {
  return apiRequest('/api/links')
}

export async function createLink(data) {
  return apiRequest('/api/links', {
    method: 'POST',
    body: data,
  })
}

export async function deleteLink(code) {
  return apiRequest(`/api/links/${code}`, {
    method: 'DELETE',
  })
}

export async function fetchLinkByCode(code) {
  return apiRequest(`/api/links/${code}`)
}

