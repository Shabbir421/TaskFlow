/** @format */

import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { AppContext } from "./context/AppContext";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user } = useContext(AppContext);


  return (
    <div className="text-default min-h-screen bg-white">
<Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        {!user && (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {/* Protected Routes */}
        {user && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
