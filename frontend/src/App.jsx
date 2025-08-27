import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router";
import Homepage from "./Pages/Homepage";
import EventsListingPage from "./Pages/EventsListingPage";
import ProfilePage from "./Pages/ProfilePage";
import UserContext from "./context/user";
import ProtectedRoute from "./Routes/ProtectedRoute";
import LoginModal from "./Modals/LoginModal";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);

  return (
    <div className="container">
      <UserContext.Provider
        value={{ accessToken, setAccessToken, role, setRole }}
      >
        <NavBar
          showNewLocationModal={showNewLocationModal}
          setShowNewLocationModal={setShowNewLocationModal}
        />
        {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
        <Routes>
          <Route
            path="/home"
            element={<Homepage showNewLocationModal={showNewLocationModal} />}
          />
          <Route path="/events/:locationId" element={<EventsListingPage />} />
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
