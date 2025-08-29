import React from "react";
import styles from "../styles/Filter.module.css";

const Filter = (props) => {
  return (
    <>
    <div className={styles.filterContainer}>
      {/* <div className={`row my-2 ${styles.filterButtons}`}> */}
        {/* <h5 className="col-md-2">Filter locations by: </h5> */}
        <h5 className={styles.filterTitle}>Regions: </h5>
        <button className={styles.filterBtn} onClick={() => props.setFilter("north")}>
          North
        </button>
        <button className={styles.filterBtn} onClick={() => props.setFilter("south")}>
          South
        </button>
        <button className={styles.filterBtn} onClick={() => props.setFilter("east")}>
          East
        </button>
        <button className={styles.filterBtn} onClick={() => props.setFilter("west")}>
          West
        </button>
      </div>
    </>
  );
};

export default Filter;
