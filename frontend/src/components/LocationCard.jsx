import React from "react";
import { useNavigate } from "react-router";
import styles from "../styles/LocationCards.module.css";

const LocationCard = (props) => {
  const navigate = useNavigate();

  return (
    <button
      className={`col-md-3 ${styles.locationCards}`}
      style={{
        backgroundImage: `url(${props.imageURI})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => navigate(`/locations/${props.locationId}`)}
    >
      <div>{props.name}</div>
      <div>{props.address.split(",")[0]}</div>
      <div>{props?.region}</div>
      {props.capacity ? <div>{`${props?.capacity}m²`}</div> : null}
      <div>{props?.startAt}</div>
      <div>{props?.endAt}</div>
    </button>
  );
};

export default LocationCard;
