import React from "react";
import useFetch from "../../hooks/useFetch";
import DoctorDetail from "./DoctorDetail";

import FadeIn from "../Shared/FadeIn";

const Doctor = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  // Updated endpoint to verify against backend routes (was /auth/doctors)
  const { data, loading, error } = useFetch(`${baseUrl}/doctors`);

  // Ensure data is an array to prevent crashes
  const doctorsList = Array.isArray(data) ? data : [];

  return (
    <section className="py-20 container mx-auto px-4" id="doctorContaints">
      <FadeIn>
        <h1 className="text-cyan-400 font-bold text-3xl text-center mb-12">
          Our Doctors
        </h1>
      </FadeIn>

      {loading ? (
        <div className="text-center">Loading Doctors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctorsList.length > 0 ? (
            doctorsList.map((item, index) => (
              <FadeIn key={item._id} delay={index * 0.2}>
                <DoctorDetail item={item} />
              </FadeIn>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              No doctors found (API might be empty or error)
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Doctor;
