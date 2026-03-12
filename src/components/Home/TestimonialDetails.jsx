import React from "react";
// import image from '../../assets/images/people-1.png'; // Placeholder for quote image
const image =
  "https://raw.githubusercontent.com/saifbasila/Doctor-Portal-Server/main/images/people-1.png";

const TestimonialDetails = ({ testimonial }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 shadow-xl rounded-2xl hover:shadow-cyan-500/20 transition-all duration-300">
      <div className="mb-6 text-center">
        <p className="text-gray-300 italic leading-relaxed">
          "{testimonial.desc || testimonial.quote}"
        </p>
        {/* Handles both 'desc' from legacy and potentially 'quote' */}
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <img
          className="w-14 h-14 rounded-full border-2 border-cyan-400 object-cover shadow-lg"
          src={
            testimonial.img ||
            `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 90)}.jpg`
          }
          alt={testimonial.name}
        />
        <div className="text-center">
          <h6 className="text-cyan-400 font-bold text-lg">
            {testimonial.name}
          </h6>
          <p className="text-sm text-gray-500">
            {testimonial.address || testimonial.from}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialDetails;
