import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Modal.module.css";
import useFetch from "../hooks/useFetch";
import ReactDOM from "react-dom";
import UserContext from "../context/user";

const AddPetOverlay = (props) => {
  const [newPet, setNewPet] = useState({});
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useFetch();
  const userContext = useContext(UserContext);

  const handleChange = (event) => {
    setNewPet((prevState) => ({
      ...prevState,
      [event.target.name]:
        event.target.type === "number"
          ? Number(event.target.value)
          : event.target.value,
    }));
  };

  const addNewPet = async () => {
    setIsError(false);
    setError(null);

    const res = await fetchData(
      "/api/pets/me",
      "POST",
      {
        username: props.username,
        name: newPet.name,
        breed: newPet.age,
        description: newPet.description,
      },
      userContext.accessToken
    );

    if (res.ok) {
      setNewPet([]);
      props.setForceRender(true);
      props.setShowAddPetModal(false);
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {isError && error}
        <div className="row my-1">
          <div className="col-md-3">Name of pet: </div>
          <input
            className="col-md-3"
            type="text"
            name="name"
            placeholder="required"
            value={newPet.name || ""}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-3">Breed: </div>
          <input
            className="col-md-3"
            type="text"
            name="breed"
            placeholder="optional"
            value={newPet.breed || ""}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-3">Age: </div>
          <input
            className="col-md-3"
            type="number"
            name="age"
            placeholder="optional"
            value={newPet.age || ""}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-3">Description: </div>
          <input
            className="col-md-3"
            type="text"
            name="description"
            placeholder="optional"
            value={newPet.description || ""}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="row my-2">
          <button className="col-md-2" onClick={addNewPet}>
            Add
          </button>
          <button
            className="col-md-2"
            onClick={() => props.setShowAddPetModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AddPetModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <AddPetOverlay
          setShowAddPetModal={props.setShowAddPetModal}
          username={props.username}
          setForceRender={props.setForceRender}
        />,
        document.querySelector("#modal-root-pet")
      )}
    </>
  );
};

export default AddPetModal;
