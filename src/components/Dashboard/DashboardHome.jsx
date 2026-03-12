import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const endpoint =
          user?.role === "patient"
            ? "/api/v1/my-appointments"
            : "/api/v1/appointments";

        const res = await axios.get(endpoint);

        // Filter by selected date
        const filtered = res.data.data.filter((app) => {
          const appDate = new Date(app.appointmentDate);
          return appDate.toDateString() === selectedDate.toDateString();
        });

        setAppointments(filtered);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };
    if (user) fetchAppointments();
  }, [selectedDate, user]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/v1/appointments/${id}`, { status });
      toast.success(`Appointment ${status} successfully`);
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app)),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const isPatient = user?.role === "patient";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
          Select Date
        </h2>
        <div className="flex justify-center calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="border-none rounded-lg shadow-sm w-full"
          />
        </div>
      </div>

      <div className="lg:col-span-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-cyan-500">Appointments</h2>
          <span className="text-gray-500 text-sm font-medium">
            {selectedDate.toDateString()}
          </span>
        </div>

        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {isPatient ? "Doctor" : "Name"}
                  </th>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-4 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 font-semibold">
                        {isPatient
                          ? app.doctor?.user?.name || "Doctor"
                          : app.patient?.name || "Unknown"}
                      </p>
                    </td>
                    <td className="px-3 py-4 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900">
                        {isPatient
                          ? app.doctor?.user?.phoneNumber || "N/A"
                          : app.patient?.phoneNumber || "N/A"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {isPatient
                          ? app.doctor?.user?.email
                          : app.patient?.email}
                      </p>
                    </td>
                    <td className="px-3 py-4 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900">{app.reason}</p>
                    </td>
                    <td className="px-3 py-4 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 border-b border-gray-200 bg-white text-sm">
                      <div className="flex gap-2">
                        {!isPatient && app.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(app._id, "approved")
                              }
                              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(app._id, "cancelled")
                              }
                              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {isPatient && app.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(app._id, "cancelled")
                            }
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                            title="Cancel Appointment"
                          >
                            <FaTimes />
                          </button>
                        )}
                        {/* <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                          View
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 flex flex-col items-center">
            <p className="mb-2">No appointments for this date.</p>
            <p className="text-xs text-gray-400">
              Select another date from the calendar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
