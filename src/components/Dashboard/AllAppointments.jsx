import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardStats from "./DashboardStats";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/v1/appointments");
        setAppointments(res.data.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <DashboardStats />
      <h2 className="text-2xl font-bold text-cyan-500 mb-6">
        All Appointments
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0 ? (
                appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 font-bold whitespace-no-wrap">
                        {app.patient?.name || "Unknown"}
                      </p>
                      <p className="text-gray-600 text-xs text-xs">
                        {app.patient?.email}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {/* If doctor population is deep, we use app.doctor.user.name, else try app.doctor.name if exists, or just ID */}
                      <p className="text-gray-900 whitespace-no-wrap">
                        {app.doctor?.user?.name || app.doctor?.name || "Doctor"}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {new Date(app.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 text-xs">{app.slotTime}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full
                        ${
                          app.status === "approved"
                            ? "bg-green-100 text-green-900"
                            : app.status === "pending"
                              ? "bg-yellow-100 text-yellow-900"
                              : "bg-red-100 text-red-900"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 opacity-50 rounded-full"
                        ></span>
                        <span className="relative capitalize">
                          {app.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full
                        ${
                          app.paymentStatus === "paid"
                            ? "bg-green-100 text-green-900"
                            : "bg-red-100 text-red-900"
                        }`}
                      >
                        <span className="relative capitalize">
                          {app.paymentStatus || "unpaid"}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
