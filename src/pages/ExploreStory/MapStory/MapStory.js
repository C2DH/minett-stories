import { useDocument } from '@c2dh/react-miller'
import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { Spinner } from 'reactstrap'
import styles from './MapStory.module.css'
import LangLink from '../../../components/LangLink'
import { ArrowDown, ArrowLeft, X } from 'react-feather'
import VisualModule from '../../../components/VisualModule'
import { useTranslation } from 'react-i18next'

const MapWrapper = lazy(() => import('./MapWrapper'))

function SideDocRelated({ docId }) {
  const [mainDoc] = useDocument(docId)

  const imageUrl =
    mainDoc.data.resolutions?.thumbnail.url ??
    mainDoc.snapshot ??
    mainDoc.attachment

  return (
    <>
      {mainDoc.documents.map((doc) => (
        <div className="border-bottom mt-2 pb-3 pt-3">
          <h4 className={styles.Title}>{doc.data.title}</h4>
          <div className="w-100">
            <img className="w-100" src={imageUrl} alt={doc.data.title} />
          </div>
          <div className={styles.Year}>{doc.data.year}</div>
          <div className={styles.Description}>{doc.data.description}</div>
        </div>
      ))}
    </>
  )
}

function SideDoc({ doc, onClose }) {
  const imageUrl =
    doc.data.resolutions?.thumbnail.url ?? doc.snapshot ?? doc.attachment
  const { t } = useTranslation()
  

  const coordinates = useMemo(() => {
    return doc.data.coordinates.geometry.coordinates ?? []
  }, [doc])


  return (
    <div className={styles.SideDoc}>
      <div className="d-flex justify-content-end">
        <div
          style={{ backgroundColor: 'var(--dark-grey)' }}
          className="btn-circle cursor-pointer"
          onClick={onClose}
        >
          <X color="white" />
        </div>
      </div>
      <div className="border-bottom pb-3 pt-3">
        <h4 className={styles.Title}>{doc.data.title}</h4>
        <div className="w-100">
          <img className="w-100" src={imageUrl} alt={doc.data.title} />
        </div>
        <div className={styles.Year}>{doc.data.year}</div>
        <div className={styles.Description}>{doc.data.description}</div>
        <a
          className="no-link"
          target={'_blank'}
          rel="noreferrer"
          href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.toString()}`}
        >
          <div className="d-flex justify-content-end cursor-pointer">
            <div className={styles.ButtonDocument}>{t('take_me_there')}</div>
          </div>
        </a>
      </div>
      <Suspense
        fallback={
          <div className="text-center py-2">
            <Spinner color="white" />
          </div>
        }
      >
        <SideDocRelated docId={doc.document_id} />
      </Suspense>
    </div>
  )
}

export default function MapStory({ story }) {
  const millerModule = story.data.chapters[0].contents.modules[0]

  const longScrollStory = story.data.chapters[story.data.chapters.length - 1]

  const { t } = useTranslation()

  // NOTE: Ya as other modules this paths sucks...
  // But i am litle less scare cause we handle runtime erros
  const mapObjects = useMemo(() => {
    return (
      millerModule.map.objects
        .filter(
          (o) => o.document.data.coordinates.geometry.coordinates.length === 2
        )
        // FIXME: THIS IS AN HACK 2 TEST RELATED STUFF!!!
        .map((obj) => ({
          ...obj,
          document: {
            ...obj.document,
            attachment:
              '/media/image/snapshots/ch14-33-Portraet-Batty-Weber-72-0-260-0.jpg',
            document_id: 99,
          },
        }))
    )
  }, [millerModule])

  const [selectedDoc, setSelectedDoc] = useState(null)
  const handleSideDocClose = useCallback(() => setSelectedDoc(null), [])

  const [goDeeper, setGoDeeper] = useState(false)
  const onGoDeeper = useCallback(() => {
    setGoDeeper(true)
    setTimeout(() => {
      window.scrollTo({ top: 200 })
    }, 150)
  }, [])

  return (
    <>
      <div className="h-100 w-100 d-flex flex-column">
        <div
          className={`${styles.ContainerMapAndSideDoc} flex-1 d-flex flex-column flex-md-row`}
        >
          <div>
            {selectedDoc ? (
              <SideDoc doc={selectedDoc} onClose={handleSideDocClose} />
            ) : (
              <div className={`${styles.BlockInfo}`}>
                <LangLink
                  style={{
                    backgroundColor: 'var(--dark-grey)',
                  }}
                  to={`/story/${story.slug}`}
                  className={'btn-circle cursor-pointer no-link'}
                >
                  <ArrowLeft />
                </LangLink>
                <div className={styles.TextContent}>
                  {millerModule.text.content}
                </div>
              </div>
            )}
          </div>
          <Suspense
            fallback={
              <div className="text-center w-100 pt-4">
                <Spinner />
              </div>
            }
          >
            <MapWrapper
              mapObjects={mapObjects}
              selectedDoc={selectedDoc}
              setSelectedDoc={setSelectedDoc}
            />
          </Suspense>
        </div>
        <div
          className="bg-white text-black d-flex align-items-center"
          style={{ height: 50 }}
        >
          {!goDeeper && (
            <div
              onClick={onGoDeeper}
              style={{ position: 'absolute', left: 0 }}
              className="w-100 d-flex justify-content-center cursor-pointer"
            >
              <div
                className={`text-color-story-map d-flex flex-row align-items-center`}
              >
                <span className="d-none d-md-block">{t('go_deeper')}</span>
                <ArrowDown className="ms-0" color={`var(--color-story-map)`} />
              </div>
            </div>
          )}
        </div>
      </div>
      {goDeeper && (
        <div className="bg-white ps-3 pe-3 ps-md-0 pe-md-0">
          {longScrollStory.contents.modules.map((millerModule, i) => (
            <VisualModule key={i} millerModule={millerModule} />
          ))}
        </div>
      )}
    </>
  )
}
