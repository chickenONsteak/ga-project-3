import React, { useContext, useState, useEffect } from "react";
import styles from "./Modal.module.css";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router";
import ReactDOM from "react-dom";
import UserContext from "../context/user";

const AddLocationOverlay = (props) => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const userContext = useContext(UserContext);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    region: "",
    capacity: "", //min 1, force validation check on submit
    imageURI: "",
  });

  const handleChange = (event) => {
    setNewLocation((prevState) => ({
      ...prevState,
      [event.target.name]:
        event.target.type === "number"
          ? Number(event.target.value)
          : event.target.value,
    }));
  };

  const createNewLocation = async () => {
    setIsError(false);
    setError(null); //ensure state is as follows when retrieving

    //react validation on frontend
    if (!newLocation.name.trim()) return setError("Name required");
    if (!newLocation.address.trim()) return setError("Address required");
    if (!newLocation.region) return setError("Region required");
    const cap = Number(newLocation.capacity);
    if (!Number.isFinite(cap) || cap < 1)
      return setError("Capacity must be >= 1"); //ensure 0 does not get sent to db
    if (!newLocation.imageURI.trim()) return setError("Image URL required");

    const res = await fetchData(
      "/api/locations", //send to collection
      "PUT",
      {
        name: newLocation.name,
        address: newLocation.address,
        region: newLocation.region, //enum inputs only
        capacity: newLocation.capacity,
        image: newLocation.imageURI,
      },
      userContext.accessToken
    );
    if (res.ok) {
      // RESET newLocation STATE
      setNewLocation({
        name: "",
        address: "",
        region: "",
        capacity: "", //min 1, force validation check on submit
        imageURI: "",
      });
      props.setShowNewLocationModal(false);
      navigate("/home"); 
    } else {
      setError(res.message || "Failed to create location"); //allow message for other errors
      setIsError(true);
    }
  };

  //   const getAllLocations = async () => {
  //     setIsError(false);
  //     setError(null);

  //     const res = await fetchData("/api/locations/", "GET");

  //     if (res.ok) {
  //       props.setAllLocations(res.data);
  //     } else {
  //       setError(res.message);
  //       setIsError(true);
  //     }
  //   };

  //   useEffect(() => {
  //     getAllLocations();
  //   }, [props.allLocations]);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {isError && error}
        <div className="row">
          <div className="col-md-4">Name of location: </div>
          <input
            className="col-md-3"
            name="name"
            type="text"
            placeholder="required"
            value={newLocation.name}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-4">Address : </div>
          <input
            className="col-md-3"
            name="address"
            type="text"
            placeholder="required"
            value={newLocation.address}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-4">Region : </div>
          <select
            className="col-md-3"
            name="region"
            value={newLocation.region}
            onChange={(event) => handleChange(event)}
          >
            <option value="" disabled>
              — Select region —
            </option>
            {/* need this if not, default value does not send to db */}
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>
        </div>
        <div className="row my-1">
          <div className="col-md-4">Capacity (size in sqft) : </div>
          <input
            className="col-md-3"
            name="capacity"
            type="number"
            placeholder="required"
            value={newLocation.capacity}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="row my-1">
          <div className="col-md-4">Image URI : </div>
          <input
            className="col-md-3"
            name="imageURI"
            type="text"
            placeholder="required"
            value={newLocation.imageURI}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="row my-2">
          <button className="col-md-2" onClick={createNewLocation}>
            Create
          </button>
          <button
            className="col-md-2"
            onClick={() => props.setShowNewLocationModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AddLocationModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <AddLocationOverlay
          setShowNewLocationModal={props.setShowNewLocationModal}
        />,
        document.querySelector("#modal-root-location")
      )}
    </>
  );
};

export default AddLocationModal;
