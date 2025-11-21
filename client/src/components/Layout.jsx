// Shared layout: header with title, max-w-5xl mx-auto, nice padding

export default function Layout({ children }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-600">TinyLink</h1>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}

