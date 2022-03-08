import Layout from '../components/Layout'
import pickBy from 'lodash/pickBy'
import { useSearchParams } from 'react-router-dom'
import { useDocumentsFacets, useInfiniteDocuments } from '@c2dh/react-miller'
import { Fragment, useEffect } from 'react'
import DocItem from '../components/DocItem'
import { useTranslation } from 'react-i18next'
import { Waypoint } from 'react-waypoint'
import styles from './Archive.module.css'

export default function Archive() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = {
    data__type: searchParams.get('data__type', '') ?? '',
    q: searchParams.get('q', '') ?? '',
  }

  useEffect(() => {
    return () => {
      console.log('Unmount archive')
    }
  }, [])

  const [docsFacets] = useDocumentsFacets({
    params: {
      facets: 'data__type',
    },
  })

  const { q, ...millerFilters } = filters
  const [docGroups, infiniteDocs] = useInfiniteDocuments({
    // suspense: !filtersOn,
    keepPreviousData: true,
    params: {
      limit: 50,
      q,
      filters: pickBy(millerFilters, Boolean),
    },
  })

  return (
    <Layout right={<div>{t('view_options')}</div>}>
      <div className="container-fluid">
        <div className="row">
          {docGroups &&
            docGroups.pages.map((docs, i) => (
              <Fragment key={i}>
                {docs &&
                  docs.results.map((doc) => (
                    <div className="col-md-3" key={doc.id}>
                      <DocItem doc={doc} />
                    </div>
                  ))}
              </Fragment>
            ))}
        </div>
        {!infiniteDocs.isFetching && infiniteDocs.hasNextPage && (
          <Waypoint onEnter={() => infiniteDocs.fetchNextPage()} />
        )}
      </div>
    </Layout>
  )
}
