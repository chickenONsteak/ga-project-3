import React, { useState } from "react";

const Filter = () => {
  const [filter, setFilter] = useState("");

  return (
    <div className="container">
      <div className="row my-2">
        <button className="col-md-1" onClick={() => setFilter("North")}>
          North
        </button>
        <button className="col-md-1" onClick={() => setFilter("South")}>
          South
        </button>
        <button className="col-md-1" onClick={() => setFilter("East")}>
          East
        </button>
        <button className="col-md-1" onClick={() => setFilter("West")}>
          West
        </button>
        <div>{filter}</div>
      </div>
    </div>
  );
};

export default Filter;
