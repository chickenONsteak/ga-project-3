import React from "react";
import { useNavigate } from "react-router";

const NavBar = () => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile-page");
  };

  return (
    <div className="container">
      <div className="row my-4">
        <button className="col-md-2">brand logo img</button>
        <div className="col-md-8"></div>
        <button className="col-md-2" onClick={handleProfile}>
          profile
        </button>
      </div>
    </div>
  );
};

export default NavBar;
