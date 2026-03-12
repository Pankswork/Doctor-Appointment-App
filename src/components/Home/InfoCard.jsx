import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// We might need to install fontawesome or use react-icons if legacy used it.
// Legacy used @fortawesome/react-fontawesome. Let's switch to react-icons for consistency if possible,
// OR keep fontawesome if we install it.
// React Icons is already in legacy (react-icons).
import { FaClock, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const InfoCard = ({ info }) => {
  // Futuristic Glassmorphism gradients
  const bgClass =
    info.background === "dark"
      ? "bg-gray-800/80 backdrop-blur-md border border-gray-700"
      : "bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md border border-cyan-400/30";

  return (
    <div
      className={`flex items-center justify-center p-6 rounded-xl shadow-lg text-white ${bgClass} gap-4 transform transition-transform duration-300 hover:scale-105`}
    >
      <div className="text-4xl">
        <info.icon />
      </div>
      <div>
        <h6 className="font-bold text-lg tracking-wide">{info.title}</h6>
        <small className="text-gray-200">{info.description}</small>
      </div>
    </div>
  );
};

export default InfoCard;
