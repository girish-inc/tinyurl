// Function handleApiError(error) → returns user-friendly string for 400, 404, 409, 500, network errors etc.

export function handleApiError(error) {
  if (!error) {
    return 'An error occurred. Please try again.'
  }

  // Check for network errors
  if (error.message === 'Failed to fetch' || error.name === 'NetworkError' || error.code === 'ERR_NETWORK') {
    return 'No internet connection'
  }

  const status = error.status || error.response?.status

  switch (status) {
    case 400:
      // Return the actual error message from the API if available
      return error.message || 'Invalid request. Please check your input.'
    case 404:
      return 'Link not found'
    case 409:
      return 'Custom code already taken'
    case 500:
      return 'Server error'
    default:
      return error.message || 'An error occurred. Please try again.'
  }
}

