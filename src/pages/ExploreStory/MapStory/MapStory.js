import { useDocument } from '@c2dh/react-miller'
import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import styles from './MapStory.module.css'
import LangLink from '../../../components/LangLink'
import { ArrowDown, ArrowLeft, X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import StoryPill from '../../../components/StoryPill'
import { getStoryType } from '../../../utils'
import DocLink from '../../../components/DocLink'
import loader from '../../../assets/loader.gif'
import LongScrollStory from '../../../components/LongScrollStory'

const MapWrapper = lazy(() => import('./MapWrapper'))

function SideDocRelated({ docId }) {
  const [mainDoc] = useDocument(docId)

  return (
    <>
      {mainDoc.documents.map((doc, index) => {
        const imageUrl =
          doc.data.resolutions?.thumbnail.url ?? doc.snapshot ?? doc.attachment
        return (
          index !== 0 && (
            <div className="border-bottom mt-2 pb-3 pt-3">
              <h4 className={styles.Title}>{doc.data.title}</h4>
              <div className="w-100">
                <DocLink prefetchOnClick slugOrId={doc.slug} className="text-decoration-none">
                  <img
                    className="w-100 cursor-pointer"
                    src={imageUrl}
                    alt={doc.data.title}
                  />
                </DocLink>
              </div>
              <div className={styles.Year}>{doc.data.year}</div>
              <div className={styles.Description}>{doc.data.description}</div>
            </div>
          )
        )
      })}
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
        <DocLink prefetchOnClick slugOrId={doc.slug} className="text-decoration-none">
          <div className="w-100">
            <img className="w-100" src={imageUrl} alt={doc.data.title} />
          </div>
        </DocLink>
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
          <div className="w-100 loader-container d-flex align-items-center justify-content-center">
            <img src={loader} alt="Loading" />
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

  const { t } = useTranslation()

  // NOTE: Ya as other modules this paths sucks...
  // But i am litle less scare cause we handle runtime erros
  const mapObjects = useMemo(() => {
    return millerModule.map.objects.filter(
      (o) => o.document.data.coordinates.geometry.coordinates.length === 2
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

  const type = getStoryType(story)

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
              <div className="w-100 loader-container d-flex align-items-center justify-content-center">
                <img src={loader} alt="Loading" />
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
          style={{ height: 70 }}
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
        <div className={styles.Content}>
          <div className="bg-white row pt-4 text-black">
            <div className="col-md-6 offset-md-3 d-flex flex-column align-items-start">
              <StoryPill type={type} />
              <h1 className={`${styles.TitleStory} m-0 p-0 mt-3`}>
                {story.data.title}
              </h1>
              <div className={`${styles.ResearchText} text-cadet-blue mt-3`}>
                {story.authors.map((a) => a.fullname).join(', ')}
              </div>
              <p className={`${styles.AbstractText} mt-3`}>
                {story.data.abstract}
              </p>
            </div>
          </div>
          <div className="bg-white">
            <LongScrollStory story={longScrollStory} />
          </div>
        </div>
      )}
    </>
  )
}
