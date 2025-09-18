import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PortalPage from "./pages/PortalPage";
import TermsOfService from "./pages/TermsOfService";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
    </Router>
  );
}