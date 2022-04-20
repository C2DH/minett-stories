import { I18nextProvider } from 'react-i18next'
import { dehydrate, QueryClient } from 'react-query'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import { createI18n } from './i18n'

export default function StaticApp({ queryClient, i18n, url }) {
  return (
    <StaticRouter location={url}>
      <I18nextProvider i18n={i18n}>
        <App client={queryClient} apiUrl={'https://minett-stories.lu/api'} />
      </I18nextProvider>
    </StaticRouter>
  )
}

export const getStaticProps = ({ url }) => {
  return {
    props: {
      i18n: createI18n(url),
      queryClient: new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
            staleTime: Infinity,
            retry: false,
            suspense: true,
          },
        },
      }),
    },
  }
}

export const getSkeletonProps = (staticProps, { queryClient }) => {
  return {
    props: {
      initialData: dehydrate(queryClient),
    },
  }
}
