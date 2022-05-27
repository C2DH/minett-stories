import { useState, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, ModalBody } from 'reactstrap'
import { useLocalStorage } from '../hooks/localStorage'
import LangLink from './LangLink'

export default function CookieConsent() {
  const [acceptCookies, setAcceptCookies ] = useLocalStorage('cookieconsent', false)
  const [isOpen, setIsOpen] = useState(false)

  useLayoutEffect(() => {
    if (!acceptCookies) {
      setIsOpen(true)
    }
  }, [acceptCookies])

  const { t } = useTranslation()

  return (
    <Modal backdrop={false} isOpen={isOpen} className={"cookie-consent-modal"}>
      <ModalBody className="auto-tip-modal bg-site-black rounded shadow">
        <div className="text-center">
          {t('text_cookie_consent')} <LangLink
            to={`/terms-of-use`}
            className="text-white"
          >
            {t('read_more')}
          </LangLink>
        </div>

        <div className="text-center mt-2">
          <button
            className="btn-auto-tip btn text-white rounded-pill bg-dark-gray shadow border"
            onClick={() => {
              setIsOpen(false);
              setAcceptCookies('yes')
            }}
          >
            {t('ok_i_got')}
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}
