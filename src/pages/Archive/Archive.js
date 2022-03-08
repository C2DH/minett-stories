import Layout from '../../components/Layout'
import { useSearchParams } from 'react-router-dom'
import { useDocumentsFacets, useInfiniteDocuments } from '@c2dh/react-miller'
import { Fragment, useState } from 'react'
import DocItem from '../../components/DocItem'
import { useTranslation } from 'react-i18next'
import { Waypoint } from 'react-waypoint'
import { Offcanvas, OffcanvasBody } from 'reactstrap'
import styles from './Archive.module.css'
import Filters from './Filters'

export default function Archive() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const filters = {
    grid: searchParams.get('grid') ?? 'M',
    types: searchParams.getAll('types') ?? [],
    q: searchParams.get('q') ?? '',
    orderby: searchParams.get('orderby') ?? 'data__date',
    noDates: (searchParams.get('noDates') ?? 'yes') === 'yes',
  }
  const [docsFacets] = useDocumentsFacets({
    params: {
      facets: 'type',
      exclude: { type: 'entity' },
    },
  })

  const [docGroups, infiniteDocs] = useInfiniteDocuments({
    // suspense: !filtersOn,
    keepPreviousData: true,
    params: {
      // TODO: How to filter noDates???
      limit: 50,
      orderby: filters.orderby,
      q: filters.q,
      filters: {
        type__in: filters.types.length > 0 ? filters.types : undefined,
      },
      exclude: { type: 'entity' },
    },
  })

  return (
    <Layout
      right={
        <div
          className="cursor-pointer position-absolute right-topbar"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? t('close_options') : t('view_options')}
        </div>
      }
    >
      <Offcanvas
        toggle={() => setShowFilters(!showFilters)}
        backdropClassName={styles.Backdrop}
        direction={'end'}
        className={styles.filters}
        isOpen={showFilters}
      >
        <OffcanvasBody className={styles.OffcanvasBody}>
          <Filters
            facets={docsFacets.facets}
            filters={filters}
            onFiltersChage={setSearchParams}
          />
        </OffcanvasBody>
      </Offcanvas>
      <div className="container-fluid">
        <div className="row p-5">
          {docGroups &&
            docGroups.pages.map((docs, i) => (
              <Fragment key={i}>
                {docs &&
                  docs.results.map((doc) => (
                    <div className="col-md-3 p-0" key={doc.id}>
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
