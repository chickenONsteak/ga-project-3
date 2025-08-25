import React from "react";
import styles from "./Modal.module.css";
import ReactDOM from "react-dom";

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <div className={styles.backdrop}>
          <div className={`container ${styles.modal}`}>{props.children}</div>
        </div>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default Modal;
