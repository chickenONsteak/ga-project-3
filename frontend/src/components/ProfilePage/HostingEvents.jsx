import React from "react";

const HostingEvents = (props) => {
  return (
    <ul style={{ listStyle: "none" }}>
      <li>{props.event.title}</li>
      <li>{props.event.startAt}</li>
      <li>{props.event.endAt}</li>
      <li>{props.event.status}</li>
      <li>{props.event.location.name}</li>
    </ul>
  );
};

export default HostingEvents;
