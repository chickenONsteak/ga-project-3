import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EventCard from "./EventCard";
import useFetch from "../../hooks/useFetch";
import styles from "../../styles/EventList.module.css";

const EventList = (refreshFromParent = 0) => { //prop from LocationsPage
  const { locationId } = useParams();
  const fetchData = useFetch();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [listRefresh, setListRefresh] = useState(0); //refetch after child changes

  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    const loadEvents = async () => {
      if (!locationId) {
        setError("No location selected.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetchData(
          `/api/locations/${locationId}`,
          "GET",
          undefined,
          token
        );
        if (!res?.ok) {
          console.log("Error fetching data.");
          return;
        }

        const fetchedEvents = res.data.hostedEvents || []; //show hosted events or empty if none
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (e) {
        console.log(e.message);
      }
    };
    loadEvents();
  }, [locationId, listRefresh, refreshFromParent]); // refetch when child sends & refresh when created event

  if (loading) return <div>Loading events…</div>;
  if (error) return <div>{error}</div>;
  if (!events.length) return <div>No events at this location yet.</div>;

  return (
    <div className={styles.eventListContainer}>
      {events.map((eventItem) => (
        <EventCard
          key={eventItem._id}
          event={eventItem}
          onJoined={() => setListRefresh((n) => n + 1)}
        />
      ))}
    </div>
  );
};

export default EventList;
