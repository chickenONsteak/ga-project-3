import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import UserDetails from "../components/ProfilePage/UserDetails";
import PetsDetails from "../components/ProfilePage/PetsDetails";
import AddPetModal from "../Modals/AddPetModal";

const ProfilePage = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useFetch();
  const userContext = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [petDetails, setPetDetails] = useState([]);
  const [showAddPetModal, setShowAddPetModal] = useState(false);

  const getOwnProfile = async () => {
    setIsError(false);
    setError(null);
    const res = await fetchData(
      "/api/profile/me",
      "GET",
      undefined,
      userContext.accessToken
    );

    if (res.ok) {
      // TO GET USERNAME
      const decoded = jwtDecode(userContext.accessToken);
      setUsername(decoded.username);
      // TO GET USER DETAILS
      setUserDetails(res.data.profile);
      // TO GET DETAILS OF PETS OWNED
      setPetDetails(res.data.pets);
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!showAddPetModal) {
      getOwnProfile();
    }
  }, [showAddPetModal]);

  return (
    <div className="container">
      {isError && error}
      {showAddPetModal && (
        <AddPetModal
          username={username}
          setShowAddPetModal={setShowAddPetModal}
        />
      )}
      {!isError && (
        <>
          <div className="row my-2">
            <div className="col-md-8">
              <h2>{`${username}'s Profile`}</h2>
              <div className="row-my-1">
                <UserDetails
                  age={userDetails.age}
                  description={userDetails.description}
                />
              </div>
            </div>

            <div className="col-md-1"></div>

            <div className="col-md-3">
              <h2>Hosting</h2>
            </div>
          </div>

          <div className="row my-2">
            <h2 className="col-md-3">Pets owned</h2>
            <button
              className="col-md-2"
              onClick={() => setShowAddPetModal(true)}
            >
              Add pet
            </button>
            <div className="row my-1">
              {petDetails.map((pet) => {
                return (
                  <div className="col-md-4" key={pet._id}>
                    <PetsDetails
                      name={pet.name}
                      breed={pet.breed}
                      age={pet.age}
                      description={pet.description}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
