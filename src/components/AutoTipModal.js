import { useEffect, useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'

export default function AutoTipModal() {
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setIsOpen(true)
  }, [])
  return (
    <Modal isOpen={isOpen} centered>
      <ModalBody className="bg-site-black rounded">
        <p>
          Move the white circle to interact with the interactive documentary.
        </p>
        <div className='text-center'>
          <button
            className="btn text-white rounded-pill btn-dark"
            onClick={() => setIsOpen(false)}
          >
            Ok, I got this
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}
