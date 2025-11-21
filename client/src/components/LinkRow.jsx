// Single row with short URL (clickable + copy), target (truncated), clicks, last clicked, delete button

import { useState } from 'react'
import { useDeleteLinkMutation } from '../hooks/useDeleteLinkMutation'
import CopyButton from './CopyButton'

export default function LinkRow({ link }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: deleteLink, isPending } = useDeleteLinkMutation()

  const shortUrl = `${window.location.origin}/${link.code}`

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleDelete = () => {
    if (showConfirm) {
      deleteLink(link.code)
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
      setTimeout(() => setShowConfirm(false), 3000)
    }
  }

  return (
    <tr className="border-b border-gray-200 transition hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <a
            href={`/${link.code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-indigo-600 hover:underline"
          >
            /{link.code}
          </a>
          <CopyButton text={shortUrl} />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="line-clamp-1 text-sm text-gray-700"
            title={link.target}
          >
            {link.target}
          </span>
          <CopyButton text={link.target} />
        </div>
      </td>
      <td className="px-4 py-3 text-center text-sm text-gray-700">
        {link.clicks || 0}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(link.lastClicked)}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
            showConfirm
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          } disabled:opacity-50`}
          title="Delete link"
        >
          {showConfirm ? 'Confirm' : '🗑️'}
        </button>
      </td>
    </tr>
  )
}

