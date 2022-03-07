import TopBar from './TopBar'

export default function Layout({ children, right }) {
  return (
    <>
      <TopBar right={right} />
      {children}
    </>
  )
}
