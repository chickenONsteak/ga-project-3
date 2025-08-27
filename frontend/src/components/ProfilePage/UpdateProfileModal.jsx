import React, { useEffect, useState } from "react";
import styles from "../../styles/Modal.module.css";
import ReactDOM from "react-dom";
import useFetch from "../../hooks/useFetch";

const UpdateProfileOverlay = (props) => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useFetch();
  const [age, setAge] = useState(0);
  const [description, setDescription] = useState("");

  const updateOwnProfile = async () => {
    setIsError(false);
    setError(null);

    const res = await fetchData("/api/profile/me", "PATCH", {
      age: age || "",
      description: description || "",
    });

    if (res.ok) {
      props.setShowUpdateProfileModal(false);
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  useEffect(() => {
    setAge(props.userDetails.age);
    setDescription(props.userDetails.description);
  }, []);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {isError && error}

        <div className="row">
          <div className="col-md-3">Age: </div>
          <input
            className="col-md-3"
            type="text"
            placeholder="optional"
            name="age"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        <div className="row my-1">
          <div className="col-md-12">Share a bit about yourself! </div>
          <textarea
            className="col-md-3"
            type="text"
            rows="4"
            cols="50"
            placeholder="optional"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="row">
          <button className="col-md-2" onClick={updateOwnProfile}>
            Update
          </button>
          <div className="col-md-1"></div>
          <button
            className="col-md-2"
            onClick={props.setShowUpdateProfileModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdateProfileModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <UpdateProfileOverlay
          userDetails={props.userDetails}
          setUserDetails={props.setUserDetails}
        />
      )}
    </>
  );
};

export default UpdateProfileModal;
