import classNames from 'classnames'
import { range } from 'lodash'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Popover, PopoverBody } from 'reactstrap'
import styles from './Archive.module.css'

export const MIN_YEAR = 1900
export const MAX_YEAR = new Date().getFullYear()

const GRIDS = ['S', 'M', 'L']

const ORDER_BYS = [
  {
    label: 'most_recent',
    value: 'data__date',
  },
  {
    label: 'least_recent',
    value: '-data__date',
  },
  {
    label: 'by_type',
    value: 'type',
  },
]

function YearPicker({ year, from, to, onChange }) {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Popover hideArrow isOpen={isOpen} placement={'top'} target={ref}>
        <PopoverBody
          className="bg-dark-gray text-white py-0"
          style={{ height: 100, overflowY: 'auto' }}
        >
          {range(from, to + 1).map((y) => (
            <div
              onClick={() => {
                onChange(y)
                setIsOpen(false)
              }}
              className="cursor-pointer"
              key={y}
            >
              {y}
            </div>
          ))}
        </PopoverBody>
      </Popover>
      <div
        style={{ userSelect: 'none' }}
        onClick={() => setIsOpen(!isOpen)}
        ref={ref}
        className="badge rounded-pill bg-dark-gray py-2 px-3 cursor-pointer position-relative"
      >
        {year}
      </div>
    </>
  )
}

export default function Filters({ facets, filters, onFiltersChage }) {
  const { t } = useTranslation()
  const [search, setSearch] = useState(filters.q)

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onFiltersChage({
            ...filters,
            q: search,
          })
        }}
      >
        <div className={styles.blockSearch}>
          <label>{t('search')}</label>
          <div>
            <input
              className={styles.inputSearch}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </form>

      <div className={styles.blockSize}>
        <label>{t('grid_size')}</label>
        <div className={styles.gridIcons}>
          {GRIDS.map((grid) => (
            <button
              onClick={() => {
                onFiltersChage({
                  ...filters,
                  grid,
                })
              }}
              className={classNames('btn', {
                [styles.ChangeSizeLink]: filters.grid !== grid,
                [styles.ChangeSizeLinkActive]: filters.grid === grid,
              })}
              key={grid}
            >
              {grid}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.blockOrder}>
        <label>{t('sort_items')}</label>
        <div>
          {ORDER_BYS.map((orderBy) => (
            <div key={orderBy.value}>
              <input
                onChange={() => {
                  onFiltersChage({
                    ...filters,
                    orderby: orderBy.value,
                  })
                }}
                type="radio"
                name="archive_orderby"
                checked={filters.orderby === orderBy.value}
              />
              <span className="ms-2">{t(`orderBy_${orderBy.label}`)}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label>{t('filter_by_type')}</label>
        {facets.type.map((facet) => (
          <div key={facet.type}>
            <input
              onChange={() => {
                if (filters.types.includes(facet.type)) {
                  onFiltersChage({
                    ...filters,
                    types: filters.types.filter((t) => t !== facet.type),
                  })
                } else {
                  onFiltersChage({
                    ...filters,
                    types: filters.types.concat(facet.type),
                  })
                }
              }}
              type="checkbox"
              checked={filters.types.includes(facet.type)}
            />
            <span className="ms-2">
              {t(`documentType_${facet.type}`)} ({facet.count})
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <label>{t('filter_by_year')}</label>
        <div className="d-flex align-items-between py-2">
          <span className="pe-2">From</span>
          <YearPicker
            onChange={(year) => {
              onFiltersChage({
                ...filters,
                fromYear: year,
              })
            }}
            year={filters.fromYear}
            from={MIN_YEAR}
            to={MAX_YEAR}
          />
          <span className="px-2">To</span>
          <YearPicker
            onChange={(year) => {
              onFiltersChage({
                ...filters,
                toYear: year,
              })
            }}
            year={filters.toYear}
            from={MIN_YEAR}
            to={MAX_YEAR}
          />
        </div>
        <div>
          <input
            type="checkbox"
            checked={filters.noDates}
            onChange={() => {
              onFiltersChage({
                ...filters,
                noDates: filters.noDates ? 'false' : 'true',
              })
            }}
          />
          <span className="ms-2">{t('include_no_dates')}</span>
        </div>
      </div>
    </div>
  )
}
