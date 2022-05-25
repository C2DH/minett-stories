import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, ModalBody } from 'reactstrap'

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(true)
//   const storeKey = 'modalTip:' + type

//   useEffect(() => {
//     const showed = sessionStorage.getItem(storeKey)
//     if (!showed) {
//       setIsOpen(true)
//     }
//   }, [storeKey])

  const { t } = useTranslation()

  return (
    <Modal backdrop={false} isOpen={isOpen} className={"cookie-consent-modal"}>
      <ModalBody className="auto-tip-modal bg-site-black rounded">
        <div className="text-center">
            {t('text_cookie_consent')}
        </div>
        <div className="text-center">
            {t('read_more')}
        </div>
        
        <div className="text-center mt-2">
          <button
            className="btn-auto-tip btn text-white rounded-pill bg-dark-gray"
            // onClick={() => {
            //   setIsOpen(false)
            //   sessionStorage.setItem(storeKey, 'yes')
            // }}
          >
            {t('ok_i_got')}
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}
