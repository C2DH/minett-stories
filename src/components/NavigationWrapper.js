import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Layout from './Layout'
import Loader from './Loader'

export default function NavigationWrapper() {
  return (
    <Suspense
      fallback={
        <Layout>
          <Loader />
        </Layout>
      }
    >
      <Outlet />
    </Suspense>
  )
}
