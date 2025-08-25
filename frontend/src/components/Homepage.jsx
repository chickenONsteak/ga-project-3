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

      <div className="row">
        {locationRes.data.map((location, idx) => {
          return (
            <LocationCard
              key={location.locationId}
              name={location.name}
              address={location.address}
              region={location.address}
              size={location.size}
              image={location.image}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Homepage;
