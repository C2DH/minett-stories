import { useDocument } from '@c2dh/react-miller'
import { Suspense, useCallback, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import LangLink from '../../components/LangLink'
import Layout from '../../components/Layout'
import Loader from '../../components/Loader'
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

  if (doc.type === 'image') {
    return <DocumentDetailImage {...passProps} />
  } else if (doc.type === 'video') {
    return <DocumentDetailVideo {...passProps} />
  } else if (doc.type === 'audio') {
    return <DocumentDetailAudio {...passProps} />
  } else if (doc.type === 'pdf') {
    return <DocumentDetailPdf {...passProps} />
  }
  // TODO: Implement other document types ....
}

// TODO: Implement much much better
function WrapWithNextPrev({ children }) {
  const { slug } = useParams()
  const location = useLocation()
  const cyclesDocSlugs = location.state?.cyclesDocSlugs
  if (!cyclesDocSlugs) {
    return children
  }
  const backgroundLocation = location.state.backgroundLocation

  const i = cyclesDocSlugs.indexOf(slug)
  const prevIndex = i === 0 ? cyclesDocSlugs.length - 1 : i - 1
  const nextIndex = i === cyclesDocSlugs.length - 1 ? 0 : i + 1

  const prevSlug = cyclesDocSlugs[prevIndex]
  const nextSlug = cyclesDocSlugs[nextIndex]

  return (
    <>
      <div style={{ position: 'absolute', left: 5, top: '50%' }}>
        <LangLink
          replace
          to={`/document/${prevSlug}`}
          state={{ cyclesDocSlugs, backgroundLocation }}
        >
          {'<-'}
        </LangLink>
      </div>
      {children}
      <div style={{ position: 'absolute', right: 5, top: '50%' }}>
        <LangLink
          replace
          to={`/document/${nextSlug}`}
          state={{ cyclesDocSlugs, backgroundLocation }}
        >
          {'->'}
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
      <div className={styles.ModalDoc}>
        <Suspense fallback={<Loader />}>
          <WrapWithNextPrev>
            <DisplayDoc isModal />
          </WrapWithNextPrev>
        </Suspense>
      </div>
    )
  }

  return (
    <Layout>
      <div className='h-100 padding-top-bar'>
        <DisplayDoc />
      </div>
    </Layout>
  )
}
