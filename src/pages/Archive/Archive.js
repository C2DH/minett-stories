import Layout from '../../components/Layout'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDocumentsFacets, useInfiniteDocuments } from '@c2dh/react-miller'
import { Fragment, useEffect, useRef, useState } from 'react'
import DocItem from '../../components/DocItem'
import { useTranslation } from 'react-i18next'
import { Waypoint } from 'react-waypoint'
import { Offcanvas, OffcanvasBody } from 'reactstrap'
import styles from './Archive.module.css'
import Filters from './Filters'
import classNames from 'classnames'

function useFilterRedirect() {
  const location = useLocation()
  const navigate = useNavigate()
  const qsRef = useRef(location.search)
  const filtersOn = location.pathname.endsWith('/filter')
  useEffect(() => {
    if (qsRef.current !== location.search) {
      qsRef.current = location.search
      if (location.search !== '' && !filtersOn) {
        navigate(`${location.pathname}/filter${location.search}`)
      }
    }
  })
  return filtersOn
}

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

  const filtersOn = useFilterRedirect()
  const [docGroups, infiniteDocs] = useInfiniteDocuments({
    suspense: !filtersOn,
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
        <span onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? t('close_options') : t('view_options')}
        </span>
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
                    <div
                      className={classNames('p-0', {
                        'col-md-2': filters.grid === 'S',
                        'col-md-3': filters.grid === 'M',
                        'col-md-6': filters.grid === 'L',
                      })}
                      key={doc.id}
                    >
                      <DocItem grid={filters.grid} doc={doc} />
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
