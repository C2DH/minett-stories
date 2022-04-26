import Layout from '../../components/Layout'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDocumentsFacets, useInfiniteDocuments } from '@c2dh/react-miller'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import DocItem from '../../components/DocItem'
import { useTranslation } from 'react-i18next'
import { Waypoint } from 'react-waypoint'
import { Offcanvas, OffcanvasBody } from 'reactstrap'
import styles from './Archive.module.css'
import Filters, { MAX_YEAR, MIN_YEAR } from './Filters'
import classNames from 'classnames'
import DocLink from '../../components/DocLink'
import { Filter, X } from 'react-feather'

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
    noDates: (searchParams.get('noDates') ?? 'true') === 'true',
    fromYear: Number(searchParams.get('fromYear') ?? MIN_YEAR),
    toYear: Number(searchParams.get('toYear') ?? MAX_YEAR),
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
      overlaps: `${filters.fromYear}-01-01,${filters.toYear}-12-31`,
      // TODO: How to filter noDates???
      limit: 50,
      orderby: filters.orderby,
      q: filters.q,
      filters: {
        type__in: filters.types.length > 0 ? filters.types : undefined,
      },
      where: {
        'Op.not': [
          { 'Op.or': [{ type: 'entity' }, { data__type: 'drawing' }] },
        ],
      },
    },
  })

  const cyclesDocSlugs = useMemo(() => {
    if (!docGroups) {
      return []
    }
    return docGroups.pages.reduce((all, docs) => {
      docs.results.forEach((doc) => {
        all.push(doc.slug)
      })
      return all
    }, [])
  }, [docGroups])

  return (
    <Layout
      right={
        <>
          <span
            className={`${styles.ViewOptions} d-none d-md-block`}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? t('close_options') : t('view_options')}
          </span>
          <span
            className="d-block d-md-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <X color="white" />
            ) : (
              <Filter fill="white" color="white" />
            )}
          </span>
        </>
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
      <div className="container-fluid padding-top-bar">
        <div className={'row p-md-5 pt-3'}>
          {docGroups &&
            docGroups.pages.map((docs, i) => (
              <Fragment key={i}>
                {docs &&
                  docs.results.map((doc) => (
                    <div
                      className={classNames('p-0', {
                        'col-md-2 col-4': filters.grid === 'S',
                        'col-md-3 col-6': filters.grid === 'M',
                        'col-md-6 col-12': filters.grid === 'L',
                      })}
                      key={doc.id}
                    >
                      <DocLink
                        slugOrId={doc.slug}
                        className="text-decoration-none"
                        state={{ cyclesDocSlugs }}
                      >
                        <DocItem grid={filters.grid} doc={doc} />
                      </DocLink>
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
