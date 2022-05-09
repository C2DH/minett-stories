import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, ModalBody } from 'reactstrap'

export default function AutoTipModal({ text, imageSource, type }) {
  const [isOpen, setIsOpen] = useState(false)
  const storeKey = 'modalTip:' + type

  useEffect(() => {
    const showed = sessionStorage.getItem(storeKey)
    if (!showed) {
      setIsOpen(true)
    }
  }, [storeKey])

  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} centered>
      <ModalBody className="bg-site-black rounded">
        <p className="text-center">{text}</p>
        <div className="d-flex justify-content-center my-4">
          <img src={imageSource} alt="tip" />
        </div>
        <div className="text-center">
          <button
            className="btn text-white rounded-pill btn-dark"
            onClick={() => {
              setIsOpen(false)
              sessionStorage.setItem(storeKey, 'yes')
            }}
          >
            {t('ok_i_got')}
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}
