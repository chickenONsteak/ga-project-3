import React, { useState } from "react";
import styles from "./Modal.module.css";

const AddLocationOverlay = (props) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [imageURI, setImageURI] = useState("");

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className="row">
          <div>Name of location: </div>
          <input
            className="col-md-3"
            type="text"
            placeholder="required"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="row my-1">
          <div>Address : </div>
          <input
            className="col-md-3"
            type="text"
            placeholder="required"
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>
        <div className="row my-1">
          <div>Region : </div>
          {/* <select></select> STOPPED HERE */}
        </div>
      </div>
    </div>
  );
};

const AddLocationModal = () => {
  return <div></div>;
};

export default AddLocationModal;
