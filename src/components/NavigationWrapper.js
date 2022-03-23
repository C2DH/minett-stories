import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Layout from './Layout'
import Loader from './Loader'

export default function NavigationWrapper() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className='padding-top-bar'>
            <Loader />
          </div>
        </Layout>
      }
    >
      <Outlet />
    </Suspense>
  )
}
