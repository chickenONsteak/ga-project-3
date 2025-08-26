import React, { useState } from "react";
import { locationRes } from "../dummyData/dummyResponse";
import { useNavigate } from "react-router";

const LocationCard = (props) => {
  const navigate = useNavigate();

  return (
    <button
      className="col-md-3 locationCards"
      style={{
        backgroundImage: `url(${props.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => navigate(`/events/${props.address}`)}
    >
      <div>{props.name}</div>
      <div>{props.address}</div>
      <div>{props.region}</div>
      <div>{props.size}</div>
    </button>
  );
};

export default LocationCard;
