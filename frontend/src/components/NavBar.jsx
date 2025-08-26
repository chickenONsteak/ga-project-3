import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import UserContext from "../context/user";

const NavBar = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const isLoggedIn = userContext.accessToken.length > 0;

  return (
    <div className="container">
      <div className="row my-4">
        <button className="col-md-2" onClick={() => navigate("/home")}>
          insert logo
        </button>
        <div className="col-md-8"></div>
        <button className="col-md-2" onClick={() => navigate("/profile-page")}>
          {isLoggedIn ? "Profile" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default NavBar;
