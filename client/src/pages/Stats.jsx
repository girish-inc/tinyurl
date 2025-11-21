// Thin page: fetches single link, big display + copy + optional QR

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchLinkByCode } from '../utils/api'
import { handleApiError } from '../errors/apiErrorHandler'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import CopyButton from '../components/CopyButton'
import { QRCodeSVG } from 'qrcode.react'

export default function Stats() {
  const { code } = useParams()

  const { data: link, isLoading, error } = useQuery({
    queryKey: ['link', code],
    queryFn: () => fetchLinkByCode(code),
  })

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  if (error) {
    const errorMessage = handleApiError(error)
    return (
      <Layout>
        <ErrorAlert message={errorMessage} />
        <Link
          to="/"
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </Layout>
    )
  }

  if (!link) {
    return (
      <Layout>
        <ErrorAlert message="Link not found" />
        <Link
          to="/"
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </Layout>
    )
  }

  const shortUrl = `${window.location.origin}/${link.code}`

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Layout>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-indigo-600 transition hover:text-indigo-700 hover:underline"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Dashboard
      </Link>

      <div className="space-y-6">
        {/* Short URL Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-sm font-medium text-gray-700">Short Link</h2>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/${link.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-2xl font-bold text-indigo-600 hover:underline"
            >
              {window.location.origin}/{link.code}
            </a>
            <CopyButton text={shortUrl} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Clicks */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Total Clicks</h3>
            <p className="text-4xl font-bold text-indigo-600">{link.clicks || 0}</p>
          </div>

          {/* Last Clicked */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Last Clicked</h3>
            <p className="text-xl font-semibold text-gray-900">{formatDate(link.lastClicked)}</p>
          </div>
        </div>

        {/* Target URL */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Target URL</h3>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={link.target}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-indigo-600 hover:underline"
            >
              {link.target}
            </a>
            <CopyButton text={link.target} />
          </div>
        </div>

        {/* QR Code */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-gray-700">QR Code</h3>
          <div className="flex justify-center">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <QRCodeSVG value={shortUrl} size={200} />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            Scan to open the short link
          </p>
        </div>
      </div>
    </Layout>
  )
}

