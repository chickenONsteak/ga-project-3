import React, { useState } from "react";
import Filter from "./Filter";
import { locationRes } from "../dummyData/dummyResponse";
import LocationCard from "./LocationCard";

const Homepage = () => {
  const [filter, setFilter] = useState("");

  return (
    <div className="container">
      <Filter setFilter={setFilter} />
      <div>{filter}</div>
      {locationRes.data.map((location, idx) => {
        return <LocationCard key={location.locationId} idx={idx} />;
      })}
    </div>
  );
};

export default Homepage;
