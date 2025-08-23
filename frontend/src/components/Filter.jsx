import React, { useState } from "react";

const Filter = (props) => {
  return (
    <div className="container">
      <div className="row my-2">
        <button className="col-md-1" onClick={() => props.setFilter("North")}>
          North
        </button>
        <button className="col-md-1" onClick={() => props.setFilter("South")}>
          South
        </button>
        <button className="col-md-1" onClick={() => props.setFilter("East")}>
          East
        </button>
        <button className="col-md-1" onClick={() => props.setFilter("West")}>
          West
        </button>
      </div>
    </div>
  );
};

export default Filter;
