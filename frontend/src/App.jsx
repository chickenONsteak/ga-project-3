import React, { useState } from "react";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router";
import Homepage from "./Pages/Homepage";
import LocationsPage from "./Pages/LocationsPage";
import ProfilePage from "./Pages/ProfilePage";
import UserContext from "./context/user";
import ProtectedRoute from "./Routes/ProtectedRoute";
import LoginModal from "./components/LoginModal";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [resetFilter, setResetFilter] = useState(false);
  const [allLocations, setAllLocations] = useState([]);

  return (
    <div className="container">
      <UserContext.Provider
        value={{ accessToken, setAccessToken, role, setRole }}
      >
        <NavBar
          setResetFilter={setResetFilter}
          allLocations={allLocations}
          setAllLocations={setAllLocations}
        />
        {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
        <Routes>
          <Route
            path="/home"
            element={
              <Homepage
                resetFilter={resetFilter}
                setResetFilter={setResetFilter}
                allLocations={allLocations}
                setAllLocations={setAllLocations}
              />
            }
          />
          <Route path="/locations/:locationId" element={<LocationsPage />} />
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
