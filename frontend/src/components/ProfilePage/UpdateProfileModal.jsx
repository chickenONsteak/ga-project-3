import React, { useState } from "react";
import styles from "../../styles/Modal.module.css";

const UpdateProfileOverlay = (props) => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {isError && error}

        <div className="row">
          <div className="col-md-3">Age: </div>
          <input className="col-md-3" type="text" placeholder="optional" />
        </div>

        <div className="row my-1">
          <div className="col-md-12">Share a bit about yourself! </div>
          <input className="col-md-3" type="text" placeholder="optional" />
        </div>
      </div>
    </div>
  );
};

const UpdateProfileModal = (props) => {
  return <div></div>;
};

export default UpdateProfileModal;
