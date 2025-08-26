import React from "react";
import { useParams } from "react-router";

const EventsListingPage = () => {
  const locationId = useParams();

  return (
    <div className="container">
      <div className="row">{JSON.stringify(locationId)}</div>
    </div>
  );
};

export default EventsListingPage;
