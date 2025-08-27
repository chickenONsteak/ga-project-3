import React, { useContext, useState } from "react";
import styles from "../../styles/Modal.module.css";
import ReactDOM from "react-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";

const UpdatePetOverlay = (props) => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const userContext = useContext(UserContext);
  const fetchData = useFetch();
  const [petName, setPetName] = useState(props.selectedPetDetails?.name || "");
  const [petBreed, setPetBreed] = useState(
    props.selectedPetDetails?.breed || ""
  );
  const [petAge, setPetAge] = useState(props.selectedPetDetails?.age || "");
  const [petDescription, setPetDescription] = useState(
    props.selectedPetDetails?.description || ""
  );
  const [petImage, setPetImage] = useState(
    props.selectedPetDetails?.image || ""
  );

  const updatePetById = async () => {
    setError(null);
    setIsError(false);

    const res = await fetchData(
      `/api/pets/${props.selectedPetDetails.id}`,
      "PATCH",
      {
        username: props.selectedPetDetails.owner,
        name: petName || "",
        breed: petBreed || "",
        age: petAge || "",
        description: petDescription || "",
        image: petImage || "",
      },
      userContext.accessToken
    );

    if (res.ok) {
      props.setShowUpdatePetModal(false);
      props.setForceRender(true);
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {isError && error}
        {!isError && "\u00a0"}

        <div className="row my-1">
          <div className="col-md-3">Name of pet: </div>
          <input
            className="col-md-3"
            type="text"
            name="name"
            placeholder="required"
            value={petName}
            onChange={(event) => setPetName(event.target.value)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-3">Breed: </div>
          <input
            className="col-md-3"
            type="text"
            name="breed"
            placeholder="optional"
            value={petBreed || ""}
            onChange={(event) => setPetBreed(event.target.value)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-3">Age: </div>
          <input
            className="col-md-3"
            type="number"
            name="age"
            placeholder="optional"
            value={petAge || ""}
            onChange={(event) => setPetAge(event.target.value)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-3">Description: </div>
          <input
            className="col-md-3"
            type="text"
            name="description"
            placeholder="optional"
            value={petDescription || ""}
            onChange={(event) => setPetDescription(event.target.value)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-3">Image URI: </div>
          <input
            className="col-md-3"
            type="text"
            name="description"
            placeholder="optional"
            value={petImage || ""}
            onChange={(event) => setPetImage(event.target.value)}
          />
        </div>

        <div className="row my-2">
          <button className="col-md-2" onClick={updatePetById}>
            Update
          </button>
          <button
            className="col-md-2"
            onClick={() => props.setShowUpdatePetModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdatePetModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <UpdatePetOverlay
          selectedPetDetails={props.selectedPetDetails}
          setShowUpdatePetModal={props.setShowUpdatePetModal}
          setForceRender={props.setForceRender}
        />,
        document.querySelector("#modal-root-updatePet")
      )}
    </>
  );
};

export default UpdatePetModal;
