import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import UserDetails from "../components/ProfilePage/UserDetails";
import PetsDetails from "../components/ProfilePage/PetsDetails";
import AddPetModal from "../components/ProfilePage/AddPetModal";
import UpdatePetModal from "../components/ProfilePage/UpdatePetModal";
import HostingEvents from "../components/ProfilePage/HostingEvents";
import LocationCard from "../components/LocationCard";
import UpdateProfileModal from "../components/ProfilePage/UpdateProfileModal";

const ProfilePage = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useFetch();
  const userContext = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [petDetails, setPetDetails] = useState([]);
  const [hostingEvents, setHostingEvents] = useState([]);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showUpdatePetModal, setShowUpdatePetModal] = useState(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [selectedPetDetails, setSelectedPetDetails] = useState([]);
  const [forceRender, setForceRender] = useState(false);

  const getOwnProfile = async () => {
    setForceRender(false);
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
      // TO GET EVENTS THAT THE USER IS HOSTING
      setHostingEvents(res.data.eventsHostedByMe);
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  const handleUpdateButton = (owner, id, name, breed, age, description) => {
    setSelectedPetDetails({ owner, id, name, breed, age, description });
    setShowUpdatePetModal(true);
  };

  const deletePetById = async (id) => {
    const res = await fetchData(
      `/api/pets/${id}`,
      "DELETE",
      undefined,
      userContext.accessToken
    );

    if (res.ok) {
      setForceRender(true);
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!showAddPetModal) {
      getOwnProfile();
    }
  }, [forceRender]);

  return (
    <div className="container">
      {showAddPetModal && (
        <AddPetModal
          username={username}
          setShowAddPetModal={setShowAddPetModal}
          setForceRender={setForceRender}
        />
      )}
      {showUpdatePetModal && (
        <UpdatePetModal
          selectedPetDetails={selectedPetDetails}
          setShowUpdatePetModal={setShowUpdatePetModal}
          setForceRender={setForceRender}
        />
      )}
      {showUpdateProfileModal && (
        <UpdateProfileModal
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          setShowUpdateProfileModal={setShowUpdateProfileModal}
          setForceRender={setForceRender}
        />
      )}

      {isError && error}
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
              <button
                className="col-md-1"
                onClick={() => setShowUpdateProfileModal(true)}
              >
                Edit
              </button>
            </div>

            <div className="col-md-1"></div>

            <div className="col-md-3">
              <h2>Hosting</h2>
              {/* <div>{JSON.stringify(hostingEvents)}</div> */}
              <div className="row my-1"></div>
              {hostingEvents.map((event) => {
                return (
                  <div key={event._id}>
                    {/* <HostingEvents event={event} /> */}
                    <LocationCard
                      name={event.title}
                      address={event.location.name}
                      region={event.startAt}
                      capacity={event.endAt}
                    />
                  </div>
                );
              })}
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
                    <button
                      onClick={() =>
                        handleUpdateButton(
                          username,
                          pet._id,
                          pet.name,
                          pet.breed,
                          pet.age,
                          pet.description,
                          pet.image
                        )
                      }
                    >
                      Update
                    </button>
                    <button onClick={() => deletePetById(pet._id)}>
                      Delete
                    </button>
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
