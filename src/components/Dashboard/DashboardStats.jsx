import React, { useEffect, useState } from "react";
import axios from "axios";

const StatCard = ({ count, label, colorClass }) => (
  <div
    className={`p-6 rounded-lg shadow-md text-white flex items-center justify-center ${colorClass}`}
  >
    <div className="text-center">
      <h2 className="text-4xl font-bold">{count}</h2>
      <p className="mt-2 text-sm uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

const DashboardStats = () => {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    todayAppointments: 0,
    totalAppointments: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/v1/admin/stats");
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard
        count={stats.pendingAppointments}
        label="Pending Appointments"
        colorClass="bg-red-500"
      />
      <StatCard
        count={stats.todayAppointments}
        label="Today Appointments"
        colorClass="bg-blue-500"
      />
      <StatCard
        count={stats.totalAppointments}
        label="Total Appointments"
        colorClass="bg-green-500"
      />
      <StatCard
        count={stats.totalPatients}
        label="Total Patients"
        colorClass="bg-yellow-500"
      />
    </div>
  );
};

export default DashboardStats;
