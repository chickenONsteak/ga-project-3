// <PetSelector/> + Join/Leave buttons
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import PetSelector from "./PetSelector";
import { jwtDecode } from "jwt-decode";
import styles from "../../styles/JoinEventPanel.module.css";

function getUserFromToken(token) {
  //if got token
  if (!token) return null; //if no token
  try {
    const d = jwtDecode(token) || {};
    const id =
      d.id ||
      d._id ||
      d.userId ||
      d.uid ||
      d.sub ||
      d.authId ||
      d.user_id ||
      null;
    const username =
      d.username || d.user || d.name || d.uname || d.login || null;
    return {
      id: id ? String(id) : null,
      username: username ? String(username) : null,
    };
  } catch {
    console.log("Login expired or invalid");
    return null; // expired toke
  }
}

const JoinEventPanel = ({ eventId, onSuccess }) => {
  const fetchData = useFetch();
  const token = localStorage.getItem("access_token") || "";
  const isLoggedIn = !!token;
  const me = getUserFromToken(token); // id & username
  const [myPets, setMyPets] = useState([]); //owned pets
  const [selectedPetIds, setSelectedPetIds] = useState([]); //bringing pets
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState("");

  //show owned pets
  useEffect(() => {
    if (!isLoggedIn) {
      setMyPets([]);
      return;
    }
    const loadPets = async () => {
      setError("");
      try {
        const res = await fetchData("/api/pets/me", "GET", undefined, token);
        if (res.ok) {
          setMyPets(res.data);
        }
      } catch (e) {
        console.log(e.message || "Unable to load pets");
      }
    };
    loadPets();
  }, [isLoggedIn, token]);

  //check if alr attending event on mount
  useEffect(() => {
    if (!isLoggedIn || !eventId || !me) return;

    const checkIfJoined = async () => {
      try {
        const res = await fetchData(
          `/api/events/${eventId}`,
          "GET",
          undefined,
          token
        );
        if (!res?.ok) return;

        const eventData = res.data.event || {};
        const users = eventData.attendeesUsers || [];
        const myId = me.id || "";

        const idMatch = myId
          ? users.some((u) => (u?._id || "") === myId) //check if my id is inside attendees list alr
          : false;

        setHasJoined(!!idMatch); //if true = joined
      } catch (e) {
        console.log(e.message);
      }
    };
    checkIfJoined();
  }, [isLoggedIn, eventId, token]); //trigger when token present or eventId changes

  const canClick = isLoggedIn && !isJoining && !isLeaving; //not in incomplete PUT/POST

  //join event with/without pets
  const handleJoin = async () => {
    if (!canClick) return;
    setIsJoining(true);
    setError("");

    try {
      const res = await fetchData(
        `/api/events/${eventId}`,
        "PUT",
        { petIds: selectedPetIds }, // [] = join without pets
        token
      );

      if (!res?.ok) {
        setError(res?.message || "Failed to join event");
        setIsJoining(false);
        return;
      }
      setHasJoined(true);
      onSuccess?.();
      setIsJoining(false);
    } catch (e) {
      setError(e.message || "Failed to join event");
      setIsJoining(false);
    }
  };

  //leave event with all joined pets
  const handleLeave = async () => {
    if (!canClick) return;
    setIsLeaving(true);
    setError("");

    try {
      const res = await fetchData(
        `/api/events/${eventId}`,
        "POST",
        undefined,
        token
      );

      if (!res?.ok) {
        setError(res?.message || "Failed to leave event");
        setIsLeaving(false);
        return;
      }
      setHasJoined(false);
      setSelectedPetIds([]); // clear selection after leaving
      onSuccess?.();
      setIsLeaving(false);
    } catch (e) {
      setError(e?.message || "Failed to leave event");
      setIsLeaving(false);
    }
  };

  // show login button if not logged in
  if (!isLoggedIn) {
    return <button type="button">Log in to join!</button>; //not yet added login option
  }

  return (
    <div className={styles.panel}>
      {!hasJoined && (
        <PetSelector
          pets={myPets}
          value={selectedPetIds}
          onChange={setSelectedPetIds}
        />
      )}

      {error ? <div className={styles.error}>{String(error)}</div> : null}
<div className={styles.btnWrapper}>
      {!hasJoined ? (
        <button
          type="button"
          className={styles.joinButton}
          disabled={!canClick}
          onClick={handleJoin}
        >
          {isJoining ? "Joining…" : "Join event"}
        </button>
      ) : (
        <button
          type="button"
          className={styles.leaveButton}
          disabled={!canClick}
          onClick={handleLeave}
        >
          {isLeaving ? "Leaving…" : "Leave event"}
        </button>
      )}</div>
    </div>
  );
};

export default JoinEventPanel;
