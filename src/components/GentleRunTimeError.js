import Layout from './Layout'

export default function GentleRunTimeError() {
  return (
    <Layout noTopBarPrefetch>
      <div className="padding-top-bar text-center">
        <div className="mt-4">
          <h1>Something went wrong 🙁</h1>
        </div>
      </div>
    </Layout>
  )
}
