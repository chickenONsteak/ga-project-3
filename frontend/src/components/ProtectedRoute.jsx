import React, { useContext, useEffect } from "react";
import UserContext from "../context/user";
import { Navigate } from "react-router";

const ProtectedRoute = (props) => {
  const userContext = useContext(UserContext);
  const isAuthenticated = userContext.accessToken.length > 0;

  useEffect(() => {
    if (!isAuthenticated) {
      props.setShowLoginModal(true);
    }
  }, [isAuthenticated, props.setShowLoginModal]);

  if (!isAuthenticated) {
    // IF NOT LOGGED IN, RETURN USER TO HOMEPAGE AND DISPLAY LOGIN MODAL
    return <Navigate to="/home" replace />;
  }

  return props.children;
};

export default ProtectedRoute;
