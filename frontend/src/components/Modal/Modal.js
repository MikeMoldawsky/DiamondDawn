import React, { useRef } from "react";
import useOnClickOutside from "hooks/useClickOutside";
import "./Modal.scss";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import classNames from "classnames";

const Modal = ({ className, close, implicitClose, withCloseBtn, withBorder, children }) => {
  const ref = useRef(null);

  useOnClickOutside(ref, close, implicitClose);

  return (
    <>
      <div className="modal-backdrop" />
      <div
        ref={ref}
        className={classNames("modal", className, {
          "with-border": withBorder,
        })}
      >
        <div className="modal-inner">
          {children}
          {withCloseBtn && (
            <HighlightOffIcon className="close" onClick={close} />
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
