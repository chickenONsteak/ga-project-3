import React from "react";

const PetsDetails = (props) => {
  return (
    <ul style={{ listStyle: "none" }}>
      <li>
        <span>Name: </span>
        {props.name}
      </li>
      <li>
        <span>Breed: </span>
        {props.breed}
      </li>
      <li>
        <span>Age: </span>
        {props.age}
      </li>
      <li>
        <span>Description: </span>
        {props.description}
      </li>
    </ul>
  );
};

export default PetsDetails;
