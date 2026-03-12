import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const ManageDoctors = () => {
  const {
    data: doctors,
    loading,
    error,
    reFetchData,
  } = useFetch("/api/v1/doctors");

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/doctors/${id}`);
      toast.success("Doctor deleted successfully");
      reFetchData();
    } catch (err) {
      toast.error("Failed to delete doctor");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-cyan-500 mb-6">Manage Doctors</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sr No
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors &&
                doctors.map((doctor, index) => (
                  <tr key={doctor._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {index + 1}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                      {doctor.user?.name || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {doctor.specialization}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
