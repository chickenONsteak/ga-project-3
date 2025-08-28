import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  const fetchData = useFetch();
  const navigate = useNavigate();

  const registerAccount = async () => {
    setIsError(false);
    setError(null);

    const res = await fetchData("/api/auth/register", "PUT", {
      username,
      password,
    });

    if (res.ok) {
      navigate("/profile");
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  return (
    <>
      <div className="row">
        <h4 className="col-md-5">Username: </h4>
        <input
          className="col-md 2"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div className="row my-1">
        <h4 className="col-md-5">Password : </h4>
        <input
          className="col-md 2"
          type="text"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="row my-1">
        <button onClick={registerAccount}>Register</button>
      </div>

      {isError && error}
    </>
  );
};

export default RegisterPage;
