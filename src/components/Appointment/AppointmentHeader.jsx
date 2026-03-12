import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentHeader = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("/api/v1/doctors");
        setDoctors(res.data.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Our Expert Doctors
        </h1>
        <p className="text-gray-600 text-lg">
          Choose from our team of qualified specialists
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            onClick={() => handleDoctorClick(doc._id)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden border border-gray-100"
          >
            <div className="relative h-48 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
              <img
                src={`http://localhost:5000${doc.image}`}
                alt={doc.user?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = "https://placehold.co/150?text=Dr";
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {doc.user?.name}
              </h3>
              <p className="text-cyan-600 font-semibold text-center mb-3">
                {doc.specialization}
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{doc.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Fee: ${doc.fees}</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No doctors available at the moment
          </p>
        </div>
      )}
    </section>
  );
};

export default AppointmentHeader;
