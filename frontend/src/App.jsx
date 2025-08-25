import React, { useState } from "react";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router";
import Homepage from "./components/Homepage";
import EventsListingPage from "./components/EventsListingPage";
import ProfilePage from "./components/ProfilePage";
import UserContext from "./context/user";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginModal from "./components/LoginModal";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="container">
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
      <NavBar />
      <UserContext.Provider
        value={{ accessToken, setAccessToken, role, setRole }}
      >
        <Routes>
          <Route path="/home" element={<Homepage />} />
          <Route path="/events/:location" element={<EventsListingPage />} />
          <Route
            path="/profile-page"
            element={
              <ProtectedRoute setShowLoginModal={setShowLoginModal}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<Navigate to="/home" replace />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
