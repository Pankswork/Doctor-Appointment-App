import React from "react";
// import doctor from '../../assets/images/doctor.png';
const doctor =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // Doctor image

import FadeIn from "../Shared/FadeIn";

const HomeAppointment = () => {
  return (
    <section className="mt-32 bg-gray-800/50 backdrop-blur-lg border-y border-white/5 text-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 -mt-32 hidden md:block">
            <FadeIn direction="up">
              <img
                src={doctor}
                alt="Doctor"
                className="h-[500px] w-auto object-contain"
              />
            </FadeIn>
          </div>
          <div className="md:w-1/2 py-10 md:py-0 md:pl-10">
            <FadeIn delay={0.2}>
              <h5 className="text-cyan-400 font-bold uppercase tracking-wide mb-2">
                Appointment
              </h5>
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                Make an appointment <br /> Today
              </h1>
              <p className="mb-8 text-gray-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Assumenda, fugit inventore minima quos consequatur, quae
                perferendis impedit, cum eius dicta pariatur asperiores? Dicta
                dolore et aut quam, saepe non debitis.
              </p>
              <button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-2 px-6 rounded shadow hover:shadow-lg transition duration-300">
                Learn More
              </button>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAppointment;
