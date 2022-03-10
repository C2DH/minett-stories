import stylesCommon from '../DocDetail.module.css'
import { useNavigate } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './DocumentDetailPdf.module.css'
import { ArrowLeft, ArrowRight, Minimize2, ZoomIn, ZoomOut } from 'react-feather'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const ZOOM_SCALE_STEP = 0.2

function BlockInfo({ doc }) {
  return (
    <>
      <div className={stylesCommon.TypeDocument}>{doc.type}</div>
      <h2 className={stylesCommon.TitleDocument}>{doc.data.title}</h2>
      <div className={stylesCommon.YearDocument}>{doc.data.year}</div>
      <div className={stylesCommon.DescriptionDocument}>
        {doc.data.description}
      </div>
    </>
  )
}

export default function DocumentDetailPdf({ isModal, doc }) {
  const navigate = useNavigate()
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const zoomInScale = useCallback(
    () => setScale((s) => s + ZOOM_SCALE_STEP),
    []
  )
  const zoomOutScale = useCallback(
    () => setScale((s) => s - ZOOM_SCALE_STEP),
    []
  )
  const resetScaleZoom = useCallback(() => setScale(1), [])

  const [containerHeight, setContainerHeight] = useState(null)
  const pdfContainerRef = useRef()
  useEffect(() => {
    setContainerHeight(pdfContainerRef.current.clientHeight)
  }, [])

  let pdfUrl = doc.attachment
  if (process.env.NODE_ENV !== 'production') {
    const baseUrlRegex = /http(s)?:\/\/([^/]+)/
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    pdfUrl = pdfUrl.replace(baseUrlRegex, baseUrl)
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  function handlePageChange(e) {
    const pageNumber = e.target.value
    if (+pageNumber <= numPages) {
      setPageNumber(+pageNumber)
    }
  }

  console.log(containerHeight)

  return (
    <div className={stylesCommon.Document}>
      <div className="row max-h-100">
        <div className="col-md-4">
          <BlockInfo doc={doc} />
        </div>
        <div className="col-md-8">
          <div className={styles.InfoPdfContainer}>
            <div className={styles.PdfContainer}>
              <div
                ref={pdfContainerRef}
                className={styles.PdfDocumentContainer}
              >
                {containerHeight && (
                  <Document
                    className={styles.pdfDocument}
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page
                      height={containerHeight}
                      scale={scale}
                      className={styles.pdfPage}
                      pageNumber={pageNumber || 1}
                    />
                  </Document>
                )}
              </div>
              <div className={styles.PdfControls}>
                <button
                  onClick={() => setPageNumber((p) => p - 1)}
                  disabled={pageNumber <= 1}
                  className="btn btn-link btn-icon-round mr-2"
                >
                  <ArrowLeft color="white"></ArrowLeft>
                </button>
                <input
                  className="page-input mr-2"
                  type="number"
                  onChange={handlePageChange}
                  value={pageNumber}
                  min="1"
                  max={numPages}
                  step="1"
                />
                {' of '}
                {numPages}
                <button
                  onClick={() => setPageNumber((p) => p + 1)}
                  disabled={pageNumber >= numPages}
                  className="btn btn-link btn-icon-round ml-2"
                >
                  <ArrowRight color="white"></ArrowRight>
                </button>

                <button
                  className="btn btn-link btn-icon-round ml-2"
                  onClick={zoomInScale}
                >
                  <ZoomIn color="white"></ZoomIn>
                </button>
                <button
                  className="btn btn-link btn-icon-round ml-2"
                  onClick={zoomOutScale}
                >
                  <ZoomOut color="white"></ZoomOut>
                </button>
                <button
                  className="btn btn-link btn-icon-round ml-2"
                  onClick={resetScaleZoom}
                >
                  <Minimize2 color="white"></Minimize2>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModal && (
        <div className={stylesCommon.CloseModal}>
          <i
            className="cursor-pointer bi bi-x-lg"
            onClick={() => navigate(-1)}
          />
        </div>
      )}
    </div>
  )
}
