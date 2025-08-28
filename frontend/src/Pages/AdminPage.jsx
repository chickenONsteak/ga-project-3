import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const AdminPage = () => {
  const fetchData = useFetch();
  const userContext = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const promoteUserByUsername = async () => {
    setIsError(false);
    setError(null);

    const res = await fetchData(
      "/api/auth/admin/promote",
      "PATCH",
      {
        username,
      },
      userContext.accessToken
    );

    if (res.ok) {
      return <div>The user is now an admin</div>;
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  return (
    <>
      <div className="col-md-4">
        "With great power comes great responsibility"
      </div>
      <div className="row">
        <h2 className="col-md-5">Promote a user to admin: </h2>
        <input
          className="col-md 2"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <div className="col-md-1"></div>
        <button className="col-md-2" onClick={promoteUserByUsername}>
          Promote
        </button>
      </div>
      {isError && error}
    </>
  );
};

export default AdminPage;
