import React, { useContext, useState } from "react";
import styles from "./Modal.module.css";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const LoginOverlay = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useFetch();
  const userContext = useContext(UserContext);

  const handleLogin = async () => {
    setIsError(false);
    setError(null);

    // do auth here
    const res = await fetchData("/api/auth/login", "POST", {
      username,
      password,
    });

    if (res.ok) {
      userContext.setAccessToken(res.data.access);
      const decoded = jwtDecode(res.data.access);
      userContext.setRole(decoded.role);
      props.setShowLoginModal(false);
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className="row">
          {isError && error}
          {!isError && "\u00a0"}
        </div>
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
          <button onClick={handleLogin}>Submit</button>
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
