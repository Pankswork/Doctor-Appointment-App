import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const PatientProfile = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // profile | appointments
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
    bloodGroup: user?.bloodGroup || "",
    gender: user?.gender || "",
    weight: user?.weight || "",
    height: user?.height || "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
  });

  // Update formData when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        bloodGroup: user.bloodGroup || "",
        gender: user.gender || "",
        weight: user.weight || "",
        height: user.height || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [user]);

  // Fetch Appointments for History
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/v1/my-appointments");
        setAppointments(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setLoading(false);
      }
    };
    if (user) fetchAppointments();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating profile...");
    try {
      await axios.patch(`/api/v1/users/${user._id}`, formData);
      toast.success("Profile updated successfully", { id: toastId });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile", { id: toastId });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-screen">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-semibold ${activeTab === "profile" ? "text-cyan-600 border-b-2 border-cyan-500" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
        <button
          className={`py-2 px-4 font-semibold ${activeTab === "appointments" ? "text-cyan-600 border-b-2 border-cyan-500" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("appointments")}
        >
          Appointment History
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="max-w-4xl">
          {!isEditing ? (
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    My Profile
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Manage your personal information
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-cyan-600 text-white px-6 py-2.5 rounded-lg hover:bg-cyan-700 transition shadow border border-cyan-600 font-medium flex items-center gap-2"
                >
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {/* Personal Details */}
                <div>
                  <h4 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                    <span className="text-xl">👤</span> Personal Details
                  </h4>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name
                      </span>{" "}
                      <span className="text-gray-900 font-medium text-lg">
                        {formData.name}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Email
                      </span>{" "}
                      <span className="text-gray-900 font-medium">
                        {formData.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Phone
                      </span>{" "}
                      <span className="text-gray-900 font-medium">
                        {formData.phoneNumber || "Not provided"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Address
                      </span>{" "}
                      <span className="text-gray-900 font-medium">
                        {formData.address || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Details */}
                <div>
                  <h4 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                    <span className="text-xl">❤️</span> Health Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Blood Group
                        </span>{" "}
                        <span className="text-gray-900 font-medium">
                          {formData.bloodGroup || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Gender
                        </span>{" "}
                        <span className="text-gray-900 font-medium capitalize">
                          {formData.gender || "-"}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Weight
                        </span>{" "}
                        <span className="text-gray-900 font-medium">
                          {formData.weight || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Height
                        </span>{" "}
                        <span className="text-gray-900 font-medium">
                          {formData.height || "-"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Date of Birth
                      </span>{" "}
                      <span className="text-gray-900 font-medium">
                        {formData.dateOfBirth || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleUpdateProfile}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Edit Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Health Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition bg-white"
                  >
                    <option value="">Select</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Weight (e.g. 70kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Height (e.g. 175cm)
                  </label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition bg-white"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  className="bg-cyan-600 text-white px-8 py-2.5 rounded-lg hover:bg-cyan-700 transition shadow-md font-medium"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 font-semibold">
                        {app.doctor?.user?.name || "Doctor"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {app.doctor?.specialization}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {new Date(app.appointmentDate).toDateString()}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {app.slotTime}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {app.reason}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${
                                                  app.status === "approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : app.status === "cancelled"
                                                      ? "bg-red-100 text-red-800"
                                                      : "bg-yellow-100 text-yellow-800"
                                                }`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                    >
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientProfile;
