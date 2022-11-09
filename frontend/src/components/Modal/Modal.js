import React, { useRef } from "react";
import useOnClickOutside from "hooks/useClickOutside";
import "./Modal.scss";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Modal = ({ close, children }) => {
  const ref = useRef(null);

  useOnClickOutside(ref, close);

  return (
    <div ref={ref} className="modal">
      <div className="modal-inner">
        {children}
        <HighlightOffIcon className="close" onClick={close} />
      </div>
    </div>
  );
};

export default Modal;
