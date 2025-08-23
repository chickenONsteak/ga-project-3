import React from "react";
import { locationRes } from "../dummyData/dummyResponse";

const LocationCard = (props) => {
  return (
    <button
      className="col-md-3 locationCards"
      style={{
        backgroundImage: `url(${locationRes.data[props.idx].image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div>{locationRes.data[props.idx].name}</div>
      <div>{locationRes.data[props.idx].address}</div>
      <div>{locationRes.data[props.idx].region}</div>
      <div>{locationRes.data[props.idx].size}</div>
    </button>
  );
};

export default LocationCard;
