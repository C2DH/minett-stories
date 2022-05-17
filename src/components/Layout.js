import TopBar from './TopBar'

export default function Layout({
  children,
  right,
  linkUrlLogo,
  noTopBarPrefetch = false,
}) {
  return (
    <>
      <TopBar
        linkUrlLogo={linkUrlLogo}
        right={right}
        noPrefetch={noTopBarPrefetch}
      />
      {children}
    </>
  )
}
