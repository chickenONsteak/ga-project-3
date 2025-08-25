import React, { useState } from "react";
import { useNavigate } from "react-router";

const NavBar = (props) => {
  const navigate = useNavigate();
  const handleProfile = () => {
    // IF NOT LOGGED IN, SHOW LOGIN MODAL — ELSE NAVIGATE TO PROFILE PAGE
    navigate("/profile-page");
  };

  return (
    <div className="container">
      <div className="row my-4">
        <button className="col-md-2" onClick={() => navigate("/home")}>
          insert logo
        </button>
        <div className="col-md-8"></div>
        <button className="col-md-2" onClick={handleProfile}>
          Login
        </button>
      </div>
    </div>
  );
};

export default NavBar;
