import React, { useState } from "react";
import EventForm from "./EventForm";
import styles from "../../styles/CreateEventButton.module.css";

const CreateEventButton = ({ locationId, onCreated }) => {
  //get props from LocationsPage
  const [open, setOpen] = useState(false); //modal closed by default
  const handleSuccess = (created) => {
    onCreated?.(created);
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Host an Event</button>

      {open && (
        // click outside of overlay also can close (prevented by stoppropagate below)
        <div className={styles.eventFormOverlay} onClick={() => setOpen(false)}>
          <div
            className={styles.eventFormContainer} //clicking in this container will not close the overlay
            onClick={(event) => event.stopPropagation()} //to not contradict clicking the above (overlay = close) - does not bubble up event
          >
            <div className={styles.eventFormHeader}>
              <h3 className={styles.eventFormTitle}>Create Event</h3>
              <button
                className={styles.eventFormCloseBtn}
                onClick={() => setOpen(false)}
              >
                X
              </button>
            </div>
            <EventForm
              locationId={locationId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEventButton;
