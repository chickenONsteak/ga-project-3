import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const ProfilePage = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useFetch();
  const userContext = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [petDetails, setPetDetails] = useState([]);

  const getAllPets = async () => {
    setIsError(false);
    setError(null);

    const res = await fetchData(
      "/api/pets/me",
      "GET",
      undefined,
      userContext.accessToken
    );

    if (res.ok) {
      const decoded = jwtDecode(userContext.accessToken);
      setUsername(decoded.username);
      setPetDetails(res.data);
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  useEffect(() => {
    getAllPets();
  }, []);

  return (
    <div className="container">
      {isError && error}
      {!isError && (
        <>
          <div className="row my-2">
            <div className="col-md-8">
              <h2>{username}</h2>
              <div className="row my-2">
                {petDetails.map((pet, idx) => {
                  return (
                    <div className="col-md-2" key={idx}>
                      <div>{pet.name}</div>
                      <div>{pet.breed}</div>
                      <div>{pet.age}</div>
                      <div>{pet.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="col-md-1"></div>

            <div className="col-md-3">
              <h2>Hosting</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
