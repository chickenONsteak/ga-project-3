import React from "react";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router";
import Homepage from "./components/Homepage";
import EventsListingPage from "./components/EventsListingPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <div className="container">
      <NavBar />
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/events/:location" element={<EventsListingPage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;
