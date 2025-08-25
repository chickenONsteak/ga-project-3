import React, { useState } from "react";
import styles from "./Modal.module.css";
import ReactDOM from "react-dom";

const LoginOverlay = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    // do auth here
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className="row">
          <input
            className="col-md-3"
            type="text"
            placeholder="username"
            onChange={(event) => setUsername(event.target.value)}
          />
          <div>{username}</div>
        </div>
        <div className="row">
          <input
            className="col-md-3"
            type="text"
            placeholder="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <div>{password}</div>
        </div>
        <div className="row">
          <button>Submit</button>
          <button onClick={() => props.setShowLoginModal(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

const LoginModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <LoginOverlay setShowLoginModal={props.setShowLoginModal} />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default LoginModal;
