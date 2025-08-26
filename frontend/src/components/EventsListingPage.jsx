import React from "react";
import { useParams } from "react-router";

const EventsListingPage = () => {
  let address = useParams();

  return (
    <div className="container">
      <div className="row">{JSON.stringify(address)}</div>
    </div>
  );
};

export default EventsListingPage;
