import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import LocationCard from "./LocationCard";
import useFetch from "../hooks/useFetch";

const Homepage = () => {
  const [filter, setFilter] = useState("");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = useFetch();
  const [locations, setLocations] = useState([]);

  const getAllLocations = async () => {
    setIsError(false);
    setError(null);

    const res = await fetchData("/api/locations/", "GET");

    if (res.ok) {
      setLocations(res.data);
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  useEffect(() => {
    getAllLocations();
  }, [filter]);

  return (
    <div className="container">
      <Filter setFilter={setFilter} />
      <div>{filter}</div>

      {isError && error}
      {!isError && (
        <div className="row">
          {locations.map((location) => {
            return (
              <LocationCard
                key={location._id}
                locationId={location._id}
                name={location.name}
                address={location.address}
                region={location.region}
                capacity={location.capacity}
                imageURI={location.image}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Homepage;
