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
  }, [isAuthenticated, props.setShowLoginModal]); // so that the App renders the login modal only after this component has completed rendering

  if (!isAuthenticated) {
    // IF NOT LOGGED IN, USER REMAINS AT SAME PAGE WITH LOGIN MODAL BEING DISPLAYED
    return <Navigate to="/home" replace />;
  }

  return props.children;
};

export default ProtectedRoute;
