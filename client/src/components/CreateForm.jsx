// Form for URL + optional custom code, loading state, inline validation, success/error messages

import { useState } from 'react'
import { useCreateLinkMutation } from '../hooks/useCreateLinkMutation'
import { handleApiError } from '../errors/apiErrorHandler'
import ErrorAlert from './ErrorAlert'
import CopyButton from './CopyButton'

export default function CreateForm() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [urlError, setUrlError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [createdLink, setCreatedLink] = useState(null)

  const { mutate: createLink, isPending, error } = useCreateLinkMutation()

  const validateUrl = (value) => {
    if (!value) {
      setUrlError('URL is required')
      return false
    }
    try {
      new URL(value)
      setUrlError('')
      return true
    } catch {
      setUrlError('Please enter a valid URL (e.g., https://example.com)')
      return false
    }
  }

  const validateCode = (value) => {
    if (!value) {
      setCodeError('')
      return true
    }
    if (value.length < 6 || value.length > 8) {
      setCodeError('Code must be 6-8 characters')
      return false
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setCodeError('Code must contain only letters and numbers')
      return false
    }
    setCodeError('')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const isUrlValid = validateUrl(url)
    const isCodeValid = validateCode(customCode)

    if (!isUrlValid || !isCodeValid) return

    createLink(
      { url, customCode: customCode || undefined },
      {
        onSuccess: (data) => {
          setUrl('')
          setCustomCode('')
          setUrlError('')
          setCodeError('')
          setCreatedLink(data)
          setSuccessMessage('Short link created!')
          setTimeout(() => {
            setSuccessMessage('')
            setCreatedLink(null)
          }, 3000)
        },
        onError: () => {
          // Error is handled by error state
        },
      }
    )
  }

  const apiError = error ? handleApiError(error) : null

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-gray-700">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              if (urlError) validateUrl(e.target.value)
            }}
            onBlur={(e) => validateUrl(e.target.value)}
            placeholder="https://example.com"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              urlError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
            }`}
            disabled={isPending}
          />
          {urlError && <p className="mt-1 text-sm text-red-600">{urlError}</p>}
        </div>

        <div>
          <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-gray-700">
            Custom Code (optional)
          </label>
          <input
            id="code"
            type="text"
            value={customCode}
            onChange={(e) => {
              setCustomCode(e.target.value)
              if (codeError) validateCode(e.target.value)
            }}
            onBlur={(e) => validateCode(e.target.value)}
            placeholder="6-8 alphanumeric characters"
            maxLength={8}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              codeError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
            }`}
            disabled={isPending}
          />
          {codeError && <p className="mt-1 text-sm text-red-600">{codeError}</p>}
        </div>

        {apiError && <ErrorAlert message={apiError} />}

        {successMessage && createdLink && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            <p className="mb-2 font-medium">{successMessage}</p>
            <div className="flex items-center gap-2">
              <a
                href={`/${createdLink.code}`}
                className="font-mono text-sm text-indigo-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {window.location.origin}/{createdLink.code}
              </a>
              <CopyButton text={`${window.location.origin}/${createdLink.code}`} />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || !url || !!urlError || !!codeError}
          className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Short Link'}
        </button>
      </form>
    </div>
  )
}

