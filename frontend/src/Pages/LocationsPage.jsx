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
  const [refreshCount, setRefreshCount] = useState(0);

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

  const handleEventCreated = (newEvent) => {
    setEvents((current) => [newEvent, ...current]);
    setRefreshCount((n) => n + 1);
  };

  if (loading) return <div>Loading page ...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!location) return <div>Location not found.</div>;

  return (
    <div className={styles.locationContainer}>
      <div
        className={styles.locationBanner}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(255,255,255,0.1)), url(${location.image})`,
        }}
      >
        <h1 className={styles.locationName}>{location.name}</h1>
        <p>{location.address}</p>
        <p>Region: {location.region}</p>
        {location.capacity ? <p>Capacity: {location.capacity}</p> : null}
      </div>

      <div className={styles.eventsList}>
        <div className={styles.eventsHeader}>
          <h2 className={styles.eventsH2}>Events</h2>
          {localStorage.getItem("access_token") && (
            <CreateEventButton
              locationId={location._id}
              onCreated={handleEventCreated}
            />
          )}
        </div>
        {/* button only available to logged in users */}
        <EventList refreshFromParent={refreshCount} />
      </div>
    </div>
  );
};

export default LocationsPage;
