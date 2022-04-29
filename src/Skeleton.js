export default function Skeleton({ appHtml, entrypoints, initialData }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2e2e2e" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {entrypoints.main
          .filter((e) => e.endsWith('.css'))
          .map((e) => (
            <link key={e} href={`/${e}`} rel="stylesheet" />
          ))}
      </head>
      <body>
        {process.env.EXPORT_STATIC_SPA_APP ? (
          <>
            <noscript>
              You need to enable JavaScript to use this website.
            </noscript>
            <div id="root" />
          </>
        ) : (
          <>
            <div
              id="root"
              dangerouslySetInnerHTML={{
                __html: appHtml,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__INITIAL_DATA__ = ${JSON.stringify(
                  initialData
                )};`,
              }}
            />
          </>
        )}
      </body>
      {entrypoints.main
        .filter((e) => e.endsWith('.js'))
        .map((e) => (
          <script key={e} src={`/${e}`} />
        ))}
    </html>
  )
}
