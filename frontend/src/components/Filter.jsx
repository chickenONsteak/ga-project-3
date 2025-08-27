import React from "react";

const Filter = (props) => {
  return (
    <div className="container">
      <div className="row my-2">
        <button className="col-md-1" onClick={() => props.setFilter("north")}>
          North
        </button>
        <button className="col-md-1" onClick={() => props.setFilter("south")}>
          South
        </button>
        <button className="col-md-1" onClick={() => props.setFilter("east")}>
          East
        </button>
        <button className="col-md-1" onClick={() => props.setFilter("west")}>
          West
        </button>
      </div>
    </div>
  );
};

export default Filter;
