import React, {useRef} from 'react'
import useOnClickOutside from "hooks/useClickOutside";
import './Modal.scss'

const Modal = ({ close, children }) => {
  const ref = useRef(null);

  useOnClickOutside(ref, close);

  return (
    <div ref={ref} className="modal">
      <div className="modal-inner">
        {children}
      </div>
    </div>
  )
}

export default Modal