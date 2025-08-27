import React from "react";
import { useNavigate } from "react-router";

const LocationCard = (props) => {
  const navigate = useNavigate();

  return (
    <button
      className="col-md-3 locationCards"
      style={{
        backgroundImage: `url(${props.imageURI})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => navigate(`/locations/${props.locationId}`)}
    >
      <div>{props.name}</div>
      <div>{props.address}</div>
      <div>{props.region}</div>
      <div>{props.capacity}</div>
    </button>
  );
};

export default LocationCard;
