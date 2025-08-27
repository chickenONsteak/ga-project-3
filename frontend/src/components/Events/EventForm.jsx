// create/edit event// create/edit event
import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import styles from "../../styles/EventForm.module.css";

const EventForm = ({ locationId, onSuccess, onCancel }) => { //props from CreateEventButton
  const fetchData = useFetch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState(""); // HTML date format (accepted in db)
  const [endAt, setEndAt] = useState("");
  const [submitting, setSubmitting] = useState(false); 
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); //does not send empty form
    setError("");

    if (!title || !startAt || !endAt) { //db req fills
      setError("Title, start and end time are required.");
      return;
    }

    const token = localStorage.getItem("access_token") || ""; // only logged in users can host

    setSubmitting(true);
    const res = await fetchData(
      `/api/events`,
      "POST",
      {
        title,
        description,
        locationId,
        startAt: new Date(startAt), //db req format
        endAt: new Date(endAt), //db req format
      },
      token
    );
    setSubmitting(false);

    if (res.ok) {
      onSuccess?.(res.data);
    } else {
      setError(typeof res?.message === "string" ? res.message : "Failed to create event");
      console.error("Create event error:", res?.message);
    }
  };

  return (

<form onSubmit={handleSubmit} className={styles.eventForm}>
  {error ? <div>{error}</div> : null}

  <label> 
    <div>Title</div>
    <input 
      value={title} 
      onChange={(e) => setTitle(e.target.value)} 
      placeholder="My pawkid's birthday pawty!" 
    />
  </label>

  <label>
    <div>Description</div>
    {/* multiline input for UX */}
    <textarea
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Important notes for your guests!"
      className={styles.descriptionFill}
    />
  </label>

  <label>
    <div>Start</div>
    {/* date and time picker as req format in db */}
    <input
      type="datetime-local"
      value={startAt}
      onChange={(e) => setStartAt(e.target.value)}
    />
  </label>

  <label>
    <div>End</div>
    <input
      type="datetime-local"
      value={endAt}
      onChange={(e) => setEndAt(e.target.value)}
    />
  </label>

  <div className={styles.buttonContainer}>
    <button type="button" onClick={onCancel} disabled={submitting}>
      Cancel
    </button>
    <button type="submit" disabled={submitting}>
      {submitting ? "Creating…" : "Create"}
      {/* prevents user from spamming create while it loads */}
    </button>
  </div>
</form>

  );
};

export default EventForm;
