import stylesCommon from '../DocDetail.module.css'
import { Document, Page, pdfjs } from 'react-pdf'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './DocumentDetailPdf.module.css'
import { ArrowLeft, ArrowRight, X, ZoomIn, ZoomOut } from 'react-feather'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const ZOOM_SCALE_STEP = 0.2

function BlockInfo({ doc }) {
  const { t } = useTranslation()
  return (
    <>
      <div className={stylesCommon.TypeDocument}>{doc.type}</div>
      <h2 className={stylesCommon.TitleDocument}>{doc.data.title}</h2>
      <div className={stylesCommon.YearDocument}>{doc.data.year}</div>
      <div className={stylesCommon.DescriptionDocument}>
        {doc.data.description}
      </div>
      {doc.data.creator && (
        <div className={stylesCommon.Creator}>
          <div className="text-uppercase">{t('creator')} </div>
          <div>{doc.data.creator}</div>
        </div>
      )}
      {doc.data.provenance && (
        <div className={stylesCommon.Creator}>
          <div className="text-uppercase">{t('provenance')} </div>
          <div>{doc.data.provenance}</div>
        </div>
      )}
      {doc.data.copyright && (
        <div className={stylesCommon.Copyright}>
          <div className="text-uppercase">{t('copyright')} </div>
          <div>{doc.data.copyright}</div>
        </div>
      )}
    </>
  )
}

export default function DocumentDetailPdf({ isModal, doc, onClose }) {
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
    const baseUrl = 'http://localhost:3000'
    pdfUrl = pdfUrl.replace(baseUrlRegex, baseUrl)
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function handlePageChange(e) {
    const pageNumber = e.target.value
    if (+pageNumber <= numPages) {
      setPageNumber(+pageNumber)
    }
  }

  return (
    <div
      className={
        isModal ? stylesCommon.DocumentModalPdf : stylesCommon.Document
      }
    >
      <div
        className={classNames('row', {
          'max-h-100': !isModal,
          'min-vh-100 max-vh-100': isModal,
        })}
      >
        <div
          className={classNames(`col-md-4 order-1 order-md-0 ${stylesCommon.BorderBlackRight}`,{
            'min-vh-100 max-vh-100 overflow-auto pb-5': isModal
          })}
        >
          <BlockInfo doc={doc} />
        </div>
        <div className={classNames("col-md-8 order-0 order-md-1",{
          'min-vh-100 max-vh-100': isModal
        })}>
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
              <div
                className={
                  isModal ? styles.PdfControlsModal : styles.PdfControls
                }
              >
                <div className="d-flex align-items-center">
                  <button
                    onClick={() => setPageNumber((p) => p - 1)}
                    disabled={pageNumber <= 1}
                    className="btn btn-link btn-circle bg-light-gray me-2"
                  >
                    <ArrowLeft color="black"></ArrowLeft>
                  </button>
                  <input
                    className={`${styles.numPagesInput} me-2`}
                    // type="number"
                    onChange={handlePageChange}
                    value={pageNumber}
                    min="1"
                    max={numPages}
                    // step="1"
                  />
                  <span className="ms-1 text-white me-2">{' of '}</span>
                  <div className={`${styles.numPages} me-2`}>{numPages}</div>
                  <button
                    onClick={() => setPageNumber((p) => p + 1)}
                    disabled={pageNumber >= numPages}
                    className="btn btn-link btn-circle bg-light-gray me-2"
                  >
                    <ArrowRight color="black"></ArrowRight>
                  </button>
                </div>
                <div
                  className={`${styles.divisoryControl} d-none d-md-block ms-3`}
                ></div>
                <div className="ms-0 ms-md-3 d-flex">
                  <button
                    className="btn btn-circle bg-light-gray ms-2"
                    onClick={zoomOutScale}
                  >
                    <ZoomOut color="black"></ZoomOut>
                  </button>

                  <button
                    className={`btn ${styles.btnReset} bg-light-gray ms-2`}
                    onClick={resetScaleZoom}
                  >
                    reset
                  </button>
                  <button
                    className="btn btn-circle bg-light-gray ms-2"
                    onClick={zoomInScale}
                  >
                    <ZoomIn color="black"></ZoomIn>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModal && (
        <div className={stylesCommon.CloseModal}>
          <X className="cursor-pointer" onClick={() => onClose()} />
        </div>
      )}
    </div>
  )
}
