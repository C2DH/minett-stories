import Layout from "../components/Layout"
import pickBy from "lodash/pickBy"
import { useSearchParams } from "react-router-dom"
import { useDocumentsFacets, useInfiniteDocuments } from "@c2dh/react-miller"
import { Fragment, useEffect, useState } from "react"
import DocItem from "../components/DocItem"
import { useTranslation } from "react-i18next"
import { Waypoint } from "react-waypoint"
import { Offcanvas } from "reactstrap"
import styles from "./Archive.module.css"

export default function Archive() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const filters = {
    data__type: searchParams.get("data__type", "") ?? "",
    q: searchParams.get("q", "") ?? "",
  }

  useEffect(() => {
    return () => {
      console.log("Unmount archive")
    }
  }, [])

  const [docsFacets] = useDocumentsFacets({
    params: {
      facets: "data__type",
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
      exclude: { type: "entity" },
    },
  })

  return (
    <Layout
      right={
        <div
          className="cursor-pointer"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? t("close_options") : t("view_options")}
        </div>
      }
    >
      <Offcanvas
        backdrop={false}
        direction={"end"}
        className={styles.filters}
        isOpen={showFilters}
      ></Offcanvas>
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
