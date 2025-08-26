import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import UserContext from "../context/user";
import logo from "../assets/logo.png";
import { jwtDecode } from "jwt-decode";

const NavBar = (props) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const isLoggedIn = userContext.accessToken.length > 0;

  // WHEN USER CLICKS LOGO, NAVIGATE TO HOMEPAGE AND RESET FILTER
  const handleClickLogo = () => {
    props.setResetFilter(true);
    navigate("/home");
    console.log(1);
  };

  return (
    <div className="container">
      <div className="row my-4">
        <img
          className="col-md-2 brand-logo"
          src={logo}
          alt="Kopi & Paws logo"
          onClick={() => handleClickLogo()}
        />

        {userContext.role === "admin" ? (
          <>
            <div className="col-md-5"></div>
            <button className="col-md-2">Add location</button>
            <div className="col-md-1"></div>
          </>
        ) : (
          <div className="col-md-8"></div>
        )}

        <button className="col-md-2" onClick={() => navigate("/profile-page")}>
          {isLoggedIn ? "Profile" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default NavBar;
