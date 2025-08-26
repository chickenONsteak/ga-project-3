import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import UserContext from "../context/user";
import logo from "../assets/logo.png";

const NavBar = (props) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const isLoggedIn = userContext.accessToken.length > 0;

  // WHEN USER CLICKS LOGO, NAVIGATE TO HOMEPAGE AND RESET FILTER
  const handleClickLogo = () => {
    props.setResetFilter(true);
    navigate("/home");
  };

  const handleLogout = () => {
    // CLEAR accessToken AND role STATES
    userContext.setAccessToken("");
    userContext.setRole("");
    navigate("/home");
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
            <div className="col-md-4"></div>
            <button className="col-md-2">Add location</button>
            <div className="col-md-1"></div>
          </>
        ) : (
          <div className="col-md-7"></div>
        )}

        {isLoggedIn ? (
          <>
            <button className="col-md-1" onClick={() => handleLogout()}>
              Logout
            </button>
            <div className="col-md-1"></div>
            <button
              className="col-md-1"
              onClick={() => navigate("/profile-page")}
            >
              Profile
            </button>
          </>
        ) : (
          <>
            <div className="col-md-2"></div>
            <button
              className="col-md-1"
              onClick={() => navigate("/profile-page")}
            >
              Login
            </button>
          </>
        )}

        {/* <button className="col-md-1" onClick={() => navigate("/profile-page")}>
          {isLoggedIn ? "Profile" : "Login"}
        </button> */}
      </div>
    </div>
  );
};

export default NavBar;
