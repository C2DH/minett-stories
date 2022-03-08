import classNames from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {GRIDS.map((grid) => (
        <button
          onClick={() => {
            onFiltersChage({
              ...filters,
              grid,
            })
          }}
          className={classNames('btn', {
            'btn-primary': filters.grid !== grid,
            'btn-success': filters.grid === grid,
          })}
          key={grid}
        >
          {grid}
        </button>
      ))}

      <div>Order By</div>
      <div>
        {ORDER_BYS.map((orderBy) => (
          <div key={orderBy.value}>
            <span>{t(`orderBy_${orderBy.label}`)}</span>
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
          </div>
        ))}
      </div>

      {facets.type.map((facet) => (
        <div>
          <span className="me-2">
            {t(`documentType_${facet.type}`)} ({facet.count})
          </span>
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
        </div>
      ))}
      <span>{t('include_no_dates')}</span>
      <input
        type="checkbox"
        checked={filters.noDates}
        onChange={() => {
          onFiltersChage({
            ...filters,
            noDates: filters.noDates ? 'no' : 'yes',
          })
        }}
      />
    </div>
  )
}
