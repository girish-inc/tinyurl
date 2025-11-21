// Thin page: uses Layout, CreateForm, LinkTable

import Layout from '../components/Layout'
import CreateForm from '../components/CreateForm'
import LinkTable from '../components/LinkTable'

export default function Dashboard() {
  // TODO: Implement dashboard page that:
  // - Uses Layout component as wrapper
  // - Renders CreateForm component
  // - Renders LinkTable component below the form
  // - Simple, clean layout

  return (
    <Layout>
      <CreateForm />
      <LinkTable />
    </Layout>
  )
}

