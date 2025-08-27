// users + pets items
import React, { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";
import styles from "../../styles/AttendeesPanel.module.css";

const AttendeesPanel = ({ eventId, refreshCount = 0 }) => {
  //prop from EventCard
  const fetchData = useFetch();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const isLoading = useRef(false);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId || isLoading.current) return; // skip if no id or already loading
      isLoading.current = true;
      setError("");
      setLoading(true);

      const token = localStorage.getItem("access_token") || "";

      try {
        const res = await fetchData(
          `/api/events/${eventId}`,
          "GET",
          undefined,
          token
        );

        if (!res?.ok) {
          return;
        }
        const eventData = res.data.event;
        setEvent(eventData);
      } catch (e) {
        console.error(e.message);
      }
      setLoading(false);
      isLoading.current = false;
    };

    loadEvent();
  }, [eventId, refreshCount]);

  if (loading) return <div>Loading attendees…</div>;
  if (error) return <div>Attendees unavailable: {String(error)}</div>;

  const users = Array.isArray(event?.attendeesUsers)
    ? event.attendeesUsers
    : []; //if exist, check array, if yes use, if empty = []
  const pets = Array.isArray(event?.attendeesPets) ? event.attendeesPets : [];

  const userCount = users.length;
  const petCount = pets.length;

  return (
    <div className={styles.attendeesWrapper}>
      <span className={styles.attendeesTitle}>Attendees</span>: {userCount}{" "}
      human{userCount !== 1 ? "s" : ""}, {petCount} pet
      {petCount !== 1 ? "s" : ""}
      {!!users.length && (
        <div className={styles.list}>
          {users.map((u) => (
            <span key={u._id} className={styles.badge}>
              {u.username}
            </span>
          ))}

          {!!pets.length && (
            <div className={styles.list}>
              {pets.map((p) => (
                <span key={p._id} className={styles.badge}>
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendeesPanel;
