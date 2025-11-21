export default function About() {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-slate-200 shadow-xl shadow-slate-900/30 backdrop-blur">
      <h2 className="text-3xl font-semibold text-white">What‘s inside?</h2>
      <ul className="list-disc space-y-3 pl-5 text-base leading-relaxed text-slate-300">
        <li>
          Latest React + Vite build tooling with fast refresh, ESM, and modern
          linting.
        </li>
        <li>React Router DOM for nested routes, loaders, and flexible layouts.</li>
        <li>
          Tailwind CSS v4 with the official Vite plugin, so you can use utility
          classes anywhere without manual config.
        </li>
      </ul>
      <p className="text-sm text-slate-400">
        Edit the components in <code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">src/pages</code> to start
        shipping your UI.
      </p>
    </section>
  )
}

