import React from "react";

const UserDetails = (props) => {
  return props.age ? (
    <ul style={{ listStyle: "none" }}>
      <li>
        <span>Age: </span>
        {props.age}
      </li>
      <li>
        <span>About me: </span>
        {props.description}
      </li>
    </ul>
  ) : (
    <div>Edit your profile to share more about yourself!</div>
  );
};

export default UserDetails;
