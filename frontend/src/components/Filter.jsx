import React from "react";
import styles from "../styles/Filter.module.css";

const Filter = (props) => {
  return (
    <div className="container">
      <div className={`row my-2 ${styles.filterButtons}`}>
        <h5 className="col-md-2">Filter locations by: </h5>
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
