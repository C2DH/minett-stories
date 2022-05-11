import { useDocument, usePrefetchDocument } from '@c2dh/react-miller'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Helmet } from 'react-helmet'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import LangLink from '../../components/LangLink'
import Layout from '../../components/Layout'
import Loader from '../../components/Loader'
import { useLangPathPrefix } from '../../hooks/langs'
import styles from './DocDetail.module.css'
import DocumentDetailAudio from './DocumentDetailAudio'
import DocumentDetailImage from './DocumentDetailImage'
import DocumentDetailPdf from './DocumentDetailPdf'
import DocumentDetailVideo from './DocumentDetailVideo'

function DisplayDoc({ isModal = false }) {
  const { slug } = useParams()
  const [doc] = useDocument(slug)
  const navigate = useNavigate()

  const onClose = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const passProps = {
    isModal,
    doc,
    onClose,
  }

  let element = null
  if (doc.type === 'image') {
    element = <DocumentDetailImage {...passProps} />
  } else if (doc.type === 'video') {
    element = <DocumentDetailVideo {...passProps} />
  } else if (doc.type === 'audio') {
    element = <DocumentDetailAudio {...passProps} />
  } else if (doc.type === 'pdf') {
    element = <DocumentDetailPdf {...passProps} />
  }
  // TODO: Implement other document types ....

  if (!isModal) {
    return (
      <>
        <Helmet defer={false}>
          <title>{`Minett Stories | ${doc.data.title ?? doc.title}`}</title>
        </Helmet>
        {element}
      </>
    )
  }
  return element
}

function MaybeWrapWithNextPrev({ children }) {
  const location = useLocation()
  const cyclesDocSlugs = location.state?.cyclesDocSlugs

  if (!cyclesDocSlugs) {
    return children
  }

  return (
    <WrapWithNextPrev cyclesDocSlugs={cyclesDocSlugs}>
      {children}
    </WrapWithNextPrev>
  )
}

function WrapWithNextPrev({ children, cyclesDocSlugs }) {
  const location = useLocation()
  const { slug } = useParams()
  const backgroundLocation = location.state.backgroundLocation
  const prefetchDocument = usePrefetchDocument()

  const i = cyclesDocSlugs.indexOf(slug)
  const prevIndex = i === 0 ? cyclesDocSlugs.length - 1 : i - 1
  const nextIndex = i === cyclesDocSlugs.length - 1 ? 0 : i + 1

  const prevSlug = cyclesDocSlugs[prevIndex]
  const nextSlug = cyclesDocSlugs[nextIndex]

  const langPrefix = useLangPathPrefix()
  const navigate = useNavigate()

  function handleNextPrevKeyDown(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prefetchDocument(prevSlug)
      navigate(`${langPrefix}/document/${prevSlug}`, {
        replace: true,
        state: { cyclesDocSlugs, backgroundLocation },
      })
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      prefetchDocument(nextSlug)
      navigate(`${langPrefix}/document/${nextSlug}`, {
        replace: true,
        state: { cyclesDocSlugs, backgroundLocation },
      })
    }
  }

  const keyDownRef = useRef(handleNextPrevKeyDown)
  useEffect(() => {
    keyDownRef.current = handleNextPrevKeyDown
  })

  useEffect(() => {
    function handleKeyDown(e) {
      const cb = keyDownRef.current
      if (typeof cb === 'function') {
        cb(e)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <div className={styles.LeftArrow}>
        <LangLink
          onMouseOver={() => prefetchDocument(prevSlug)}
          replace
          className={'btn-circle text-white bg-dark-gray'}
          to={`/document/${prevSlug}`}
          state={{ cyclesDocSlugs, backgroundLocation }}
        >
          <ArrowLeft />
        </LangLink>
      </div>
      {children}
      <div className={styles.RightArrow}>
        <LangLink
          onMouseOver={() => prefetchDocument(nextSlug)}
          replace
          className={'btn-circle text-white bg-dark-gray'}
          to={`/document/${nextSlug}`}
          state={{ cyclesDocSlugs, backgroundLocation }}
        >
          <ArrowRight />
        </LangLink>
      </div>
    </>
  )
}

export default function DocDetail({ isModal = false }) {
  useEffect(() => {
    if (isModal) {
      document.body.classList.add('block-scroll')
      return () => document.body.classList.remove('block-scroll')
    }
  }, [isModal])

  if (isModal) {
    return (
      <div className={`${styles.ModalDoc} h-100`}>
        <Suspense fallback={<Loader />}>
          <MaybeWrapWithNextPrev>
            <DisplayDoc isModal />
          </MaybeWrapWithNextPrev>
        </Suspense>
      </div>
    )
  }

  return (
    <Layout>
      <div className="h-100 padding-top-bar pb-4">
        <DisplayDoc />
      </div>
    </Layout>
  )
}
