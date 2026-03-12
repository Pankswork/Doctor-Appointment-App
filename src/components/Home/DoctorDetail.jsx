import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const DoctorDetail = ({ item }) => {
  return (
    <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:shadow-cyan-500/20 shadow-xl transition-all duration-300">
      <img
        src={
          item.img ||
          `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 90)}.jpg`
        }
        alt={item.username}
        className="w-full h-64 object-cover mb-4 rounded-xl border border-white/10"
      />
      <h4 className="text-xl font-bold text-white mb-2">{item.username}</h4>
      <div className="mt-2 text-gray-300 text-sm flex flex-col items-center gap-2">
        <p className="flex items-center gap-2">
          <FaPhoneAlt className="text-cyan-400" /> +88017547512
        </p>
        <p className="flex items-center gap-2">
          <FaEnvelope className="text-cyan-400" /> {item.email}
        </p>
      </div>
    </div>
  );
};

export default DoctorDetail;
