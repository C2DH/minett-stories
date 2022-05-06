import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Layout from './Layout'
import Loader from './Loader'

export default function NavigationWrapper() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="padding-top-bar d-flex align-items-center justify-content-center loader-container w-100">
            <Loader />
          </div>
        </Layout>
      }
    >
      <Outlet />
    </Suspense>
  )
}
