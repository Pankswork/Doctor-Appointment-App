import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUser,
  FaHome,
  FaThLarge,
  FaUserPlus,
  FaCalendarAlt,
  FaClipboardList,
  FaSignOutAlt,
  FaEnvelope,
  FaUserMd,
} from "react-icons/fa";

const Sidebar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-cyan-500 text-white"
      : "text-gray-400 hover:text-white hover:bg-gray-700";

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col justify-between py-6 px-4 fixed left-0 top-0 z-50">
      <div>
        <div className="mb-8 px-2">
          <h2 className="text-2xl font-bold tracking-wider">
            Dental<span className="text-cyan-400">Portal</span>
          </h2>
        </div>

        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive("/dashboard")}`}
          >
            <FaThLarge /> Dashboard
          </Link>
          <Link
            to="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive("/dashboard/profile")}`}
          >
            <FaUser /> My Profile
          </Link>
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive("/")}`}
          >
            <FaHome /> Home
          </Link>

          {user?.role === "admin" && (
            <>
              <Link
                to="/dashboard/appointments"
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive("/dashboard/appointments")}`}
              >
                <FaCalendarAlt /> Appointments
              </Link>
              <Link
                to="/dashboard/add-doctor"
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive("/dashboard/add-doctor")}`}
              >
                <FaUserPlus /> Add Doctor
              </Link>
              <Link
                to="/dashboard/messages"
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive("/dashboard/messages")}`}
              >
                <FaEnvelope /> Messages
              </Link>
              <Link
                to="/dashboard/doctors"
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive("/dashboard/doctors")}`}
              >
                <FaClipboardList /> Manage Doctors
              </Link>
              <Link
                to="/dashboard/doctor-list"
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive("/dashboard/doctor-list")}`}
              >
                <FaUserMd /> Doctor List
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
            <FaUser className="text-sm" />
          </div>
          <div>
            <p className="text-sm font-semibold">{user?.username}</p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role || "Patient"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-white hover:bg-red-500/10 rounded transition-colors"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
