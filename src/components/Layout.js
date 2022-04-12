import TopBar from './TopBar'

export default function Layout({ children, right, linkUrlLogo }) {
  return (
    <>
      <TopBar linkUrlLogo={linkUrlLogo} right={right} />
      {children}
    </>
  )
}
