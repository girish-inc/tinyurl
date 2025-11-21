// Reusable red alert box that takes a message

export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="flex-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

