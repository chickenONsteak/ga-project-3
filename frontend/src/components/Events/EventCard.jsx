import React, { useState } from "react";
import JoinEventPanel from "./JoinEventPanel";
import AttendeesPanel from "./AttendeesPanel";
import useFetch from "../../hooks/useFetch";
import { jwtDecode } from "jwt-decode";
import styles from "../../styles/EventCard.module.css";

const EventCard = ({ event, onJoined }) => {
  const { _id, title, description, startAt, endAt, hostUserId } = event; //deconstruct event object
  const hostUsername = event.hostUsername;
  const [refreshCount, setRefreshCount] = useState(0); //AttendeesPanel to refresh data
  const [error, setError] = useState("");
  const [status, setStatus] = useState(event.status || "scheduled"); //default is alr scheduled
  const [savingStatus, setSavingStatus] = useState(false);
  const fetchData = useFetch();
  const token = localStorage.getItem("access_token") || "";

  const me = (() => {
    try {
      if (!token) return null;
      const decoded = jwtDecode(token);
      const isAdmin = (decoded.role || "").toLowerCase() === "admin";
      return {
        id: decoded.id || "",
        username: (decoded.username || "").toLowerCase(),
        isAdmin,
      };
    } catch {
      console.log("Login expired or invalid");
      return null; // expired token
    }
  })(); //call function

  const isHost =
    hostUsername && me?.username //if both host and my name exists
      ? hostUsername.toLowerCase() === me.username // compare names
      : false; // not host

  // allowed to manage (host or admin)
  const canManage = !!(me?.isAdmin || isHost);

  //styling event status
  const statusStyle =
    (status === "scheduled" && {
      background: "#eef6ff",
      color: "#084298",
    }) ||
    (status === "cancelled" && { background: "#fde7e9", color: "#842029" }) ||
    (status === "completed" && { background: "#e7f5ee", color: "#0f5132" });

  // change status (only for host/admin)
  const updateStatus = async (newStatus) => {
    if (!canManage || !newStatus || newStatus === status) return; //not authorised or same status, return
    setSavingStatus(true);
    setError("");
    const res = await fetchData(
      `/api/events/${_id}`,
      "PATCH",
      { status: newStatus },
      token
    );
    setSavingStatus(false);
    if (!res?.ok) {
      setError("Failed to update status");
      return;
    }
    setStatus(newStatus);
    handleJoined(); // ask children to refresh
  };

  // when updated, refetch + refresh list
  const handleJoined = () => {
    setRefreshCount((n) => n + 1); // change state = cause reredner (AttendeesPanel)
    onJoined?.(); // refresh EventList
  };

  // delete event (host/admin)
  const handleDelete = async () => {
    if (!canManage) return;
    setError("");
    const res = await fetchData(
      `/api/events/${_id}`,
      "DELETE",
      undefined,
      token
    );
    if (!res?.ok) {
      setError("Failed to delete event");
      return;
    }
    onJoined?.(); // refresh EventList
  };

  return (
    <div className={styles.eventCard}>
      <div className={styles.headerRow}>
        <div className={styles.eventCardLeft}>
          <h3 className={styles.title}>{title}</h3>
          <div>
            <p></p>
            {new Date(startAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
            <span> - </span>
            {new Date(endAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div className={styles.statusRow}>
            <span className={styles.statusBadge} style={statusStyle}>
              {status}
            </span>

            {canManage && (
              <select
                value={status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={savingStatus}
                className={styles.statusSelect}
                title="Change status"
              >
                <option value="scheduled">scheduled</option>
                <option value="cancelled">cancelled</option>
                <option value="completed">completed</option>
              </select>
            )}
          </div>
          <div>
            <b>Host:</b> {hostUsername ? hostUsername : "Unknown"}
          </div>

          {description ? (
            <div className={styles.description}>
              <b>Description: </b>
              {description}
            </div>
          ) : null}
        </div>
        <div className={styles.eventCardMiddle}>
          <AttendeesPanel eventId={_id} refreshCount={refreshCount} />
        </div>
        <div className={styles.actions}>
          {canManage && (
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          <JoinEventPanel eventId={_id} onSuccess={handleJoined} />
          {error ? <div className={styles.errorText}>{error}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
