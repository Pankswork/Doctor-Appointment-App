import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const DoctorList = () => {
  const { data: doctors, loading, error } = useFetch("/api/v1/doctors");

  if (loading) return <div className="p-8">Loading doctors...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error loading doctors</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-cyan-500 mb-6">Doctor List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Specialization
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fees
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors &&
              doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <img
                      src={`http://localhost:5000${doctor.image}`}
                      alt={doctor.user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/50?text=Dr";
                      }}
                    />
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                    {doctor.user?.name || "N/A"}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {doctor.specialization}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {doctor.experience}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    ${doctor.fees}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {doctor.user?.phoneNumber || "N/A"}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Link
                      to={`/dashboard/edit-doctor/${doctor._id}`}
                      className="text-blue-500 hover:text-blue-700 ml-2"
                    >
                      <FaEdit />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorList;
