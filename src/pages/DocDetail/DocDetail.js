import { useDocument } from '@c2dh/react-miller'
import { Suspense, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import Loader from '../../components/Loader'
import styles from './DocDetail.module.css'

function DisplayDoc({ isModal = false }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [doc] = useDocument(slug)
  return (
    <div>
      {isModal && <button onClick={() => navigate(-1)}>Back</button>}
      <div>DOC DETAIL: {doc.slug}</div>
      <img height={400} src={doc.attachment} alt={doc.data.title} />
    </div>
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
          <DisplayDoc isModal />
        </Suspense>
      </div>
    )
  }

  return (
    <Layout>
      <DisplayDoc />
    </Layout>
  )
}
