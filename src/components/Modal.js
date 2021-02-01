import ReactDOM from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import useDraggable from "../hooks/useDraggable";
import Button from "./Button";
import "../assets/styles/Modal.css";
import { FiX } from "react-icons/fi";

const Modal = ({ show, title, handleSubmit, setModal, disabled, children, size = "xs" }) => {
  const [fade, setFade] = useState("");
  const modalRef = useRef(null);
  const modalBackdropRef = useRef(null);
  const [position, handleDrag] = useDraggable(modalRef.current);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    function keyClose(e) {
      if (e.key === "Escape") handleHide();
    }
    if (show) {
      setTimeout(() => setFade("in"), 0);
      document.addEventListener("keydown", keyClose);
    } else {
      document.removeEventListener("keydown", keyClose);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    const modalDOM = modalRef.current;
    if (modalDOM) {
      modalDOM.style.top = `${position.top}px`;
      modalDOM.style.left = `${position.left}px`;
    }
  }, [position]);

  useEffect(() => {
    if (show) setModalShow(true);
    else handleHide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleOutside = (e) => {
    if (e.target === modalBackdropRef.current) handleHide();
  };

  const handleHide = () => {
    setFade("out");
    setModal((prev) => ({ ...prev, show: false }));
    setTimeout(() => {
      setModalShow(false);
      setFade("");
    }, 200);
  };

  return modalShow
    ? ReactDOM.createPortal(
        <div className={`modal-container show ${fade}`} onClick={handleOutside}>
          <div className={`modal modal-${size ? size : "sm"}`} ref={modalRef}>
            <div className="modal-header" onMouseDown={handleDrag}>
              <h4>{title}</h4>
              <button className="close-button" onClick={handleHide}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              {!disabled && <Button onClick={handleSubmit}>Guardar</Button>}
              <Button onClick={handleHide} color="transparent" style={{ marginRight: 10 }}>
                Cancelar
              </Button>
            </div>
          </div>
          <div className="backdrop" ref={modalBackdropRef} />
        </div>,
        document.body
      )
    : null;
};

export default Modal;
