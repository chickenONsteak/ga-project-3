import React from "react";
import { locationRes } from "../dummyData/dummyResponse";

const LocationCard = (props) => {
  return (
    <div className="col-md-4">
      <div>{locationRes.data[props.idx].name}</div>
    </div>
  );
};

export default LocationCard;
