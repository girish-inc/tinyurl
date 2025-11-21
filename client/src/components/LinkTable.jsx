// Table wrapper (handles empty/loading/error states)

import { useLinksQuery } from '../hooks/useLinksQuery'
import { useDeleteLinkMutation } from '../hooks/useDeleteLinkMutation'
import { handleApiError } from '../errors/apiErrorHandler'
import LoadingSpinner from './LoadingSpinner'
import ErrorAlert from './ErrorAlert'
import LinkRow from './LinkRow'
import CopyButton from './CopyButton'

export default function LinkTable() {
  const { links, isLoading, error, refetch, isRefetching } = useLinksQuery()
  const { mutate: deleteLink } = useDeleteLinkMutation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorAlert
        message={handleApiError(error)}
        onRetry={() => refetch()}
      />
    )
  }

  if (links.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-gray-600">No links yet. Create one!</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-700">Your Links</h2>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          title="Refresh click counts"
        >
          <svg
            className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Short Link
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Target URL
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700">
                Clicks
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Last Clicked
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {links.map((link) => (
              <LinkRow key={link.code} link={link} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 p-4 md:hidden">
        {links.map((link) => (
          <div
            key={link.code}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2">
              <a
                href={`/${link.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-medium text-indigo-600 hover:underline"
              >
                /{link.code}
              </a>
              <CopyButton text={`${window.location.origin}/${link.code}`} />
            </div>
            <div className="mb-2">
              <p className="mb-1 text-xs text-gray-500">Target URL</p>
              <p className="line-clamp-2 text-sm text-gray-700" title={link.target}>
                {link.target}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{link.clicks || 0}</span> clicks
              </div>
              <div className="text-xs text-gray-500">
                {link.lastClicked
                  ? new Date(link.lastClicked).toLocaleDateString()
                  : 'Never clicked'}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <CopyButton text={link.target} />
              <button
                onClick={() => {
                  if (window.confirm('Delete this link?')) {
                    deleteLink(link.code)
                  }
                }}
                className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

