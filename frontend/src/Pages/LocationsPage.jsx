import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import EventList from "../components/Events/EventList";
import styles from "../styles/LocationsPage.module.css";
import CreateEventButton from "../components/Events/CreateEventButton";

const LocationsPage = () => {
  const { locationId } = useParams();
  const fetchData = useFetch();

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!locationId) return;
      setLoading(true);
      setError("");

      try {
        const res = await fetchData(
          `/api/locations/${locationId}`,
          "GET",
          undefined,
          "" //empty for public use
        );

        if (res.ok) {
          const payload = res.data;
          setLocation(payload.location);
          setEvents(payload.events ?? []); //send empty array if no events for locationId
          setLoading(false);
        } else {
          setLocation(null);
          setEvents([]);
          setError(
            typeof res?.message === "string"
              ? res.message
              : "Failed to load location"
          );
          console.error("Error:", res?.message);
        }
      } catch (e) {
        setError(e?.message || "Network error"); //fallback error msg
        setLocation(null);
        setEvents([]);
        console.error("Network error:", e);
      }
    };

    load();
  }, [locationId]);

   const handleEventCreated = (created) => {
    setEvents((prev) => [created, ...prev]); }

  if (loading) return <div>Loading page ...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!location) return <div>Location not found.</div>;

  return (
    <div className={styles.locationContainer}>
      <div
        className={styles.locationBanner}
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(0,0,0,0.4)), url(${location.image})`,
        }}
      >
        <h1 className={styles.locationName}>{location.name}</h1>
        <p>{location.address}</p>
        <p>{location.region}</p>
        {location.capacity ? <p>Capacity: {location.capacity}</p> : null}
      </div>

      <div className={styles.eventsList}>
        <h2 className={styles.eventsH2}>Events</h2>
        {localStorage.getItem("access_token") && (
       <CreateEventButton
            locationId={location._id}
            onCreated={handleEventCreated}
          />
          )}
          {/* button only available to logged in users */}
        <EventList events={events} />
      </div>
    </div>
  );
};

export default LocationsPage;
