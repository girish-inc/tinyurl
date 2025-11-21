// Only contains <QueryClientProvider> + <BrowserRouter> + Routes

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import ShortLinkRedirect from './components/ShortLinkRedirect'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/code/:code" element={<Stats />} />
          {/* Catch-all route for short link codes (6-8 alphanumeric characters) */}
          <Route path="/:code" element={<ShortLinkRedirect />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
