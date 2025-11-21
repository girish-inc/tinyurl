export default function Home() {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-slate-900/40 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
        Welcome to TinyLink
      </p>
      <h1 className="text-4xl font-bold text-white sm:text-5xl">
        Ship a polished React app faster
      </h1>
      <p className="text-lg leading-relaxed text-slate-300">
        Your Vite + React + Tailwind v4 stack is ready to go. Start building
        interactive dashboards, marketing sites, or internal tools with best
        practices baked in from the jump.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="https://tailwindcss.com/docs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          Tailwind Docs
        </a>
        <a
          href="https://reactrouter.com/en/main"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-white transition hover:border-slate-500 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          React Router Docs
        </a>
      </div>
    </section>
  )
}

