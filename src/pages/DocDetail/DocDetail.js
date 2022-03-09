import { useDocument } from "@c2dh/react-miller"
import { Suspense, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Layout from "../../components/Layout"
import Loader from "../../components/Loader"
import styles from "./DocDetail.module.css"
import DocumentDetailAudio from "./DocumentDetailAudio"
import DocumentDetailImage from "./DocumentDetailImage"
import DocumentDetailPdf from "./DocumentDetailPdf"
import DocumentDetailVideo from "./DocumentDetailVideo"

function DisplayDoc({ isModal = false }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [doc] = useDocument(slug)
  console.log(doc)
  if (doc.type === "image") {
    return <DocumentDetailImage isModal={isModal} doc={doc} />
  } else if (doc.type === "video") {
    return <DocumentDetailVideo isModal={isModal} doc={doc} />
  } else if (doc.type === "audio") {
    return <DocumentDetailAudio isModal={isModal} doc={doc} />
  } else if (doc.type === "pdf") {
    return <DocumentDetailPdf isModal={isModal} doc={doc} />
  }
  // TODO: Implement other document types ....
}

export default function DocDetail({ isModal = false }) {
  useEffect(() => {
    if (isModal) {
      document.body.classList.add("block-scroll")
      return () => document.body.classList.remove("block-scroll")
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
