import React, { useEffect, useState } from "react";
import Filter from "../components/Filter";
import LocationCard from "../components/LocationCard";
import useFetch from "../hooks/useFetch";
import styles from "../styles/Homepage.module.css";

const Homepage = (props) => {
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
      // IF THERE'S FILTER
      if (filter) {
        const filteredLocations = res.data.filter(
          (location) => location.region === filter
        );
        setLocations(filteredLocations);
      } else {
        setLocations(res.data);
      }
    } else {
      setError(res.message);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!props.showNewLocationModal) getAllLocations();
  }, [filter, props.showNewLocationModal]);

  return (
    <div className={styles.homeContainer}>
      <Filter setFilter={setFilter} />

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
