import React from "react";
import TestimonialDetails from "./TestimonialDetails";
import useFetch from "../../hooks/useFetch";

import FadeIn from "../Shared/FadeIn";

const Testimonial = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  // Fallback to static data if API fails or is empty for demo purposes
  const { data, loading, error } = useFetch(`${baseUrl}/auth/reviews`);

  // Ensure data is valid array, otherwise use fallback
  const fallbackData = [
    {
      _id: 1,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic non architecto nobis, adipisci recusandae voluptas accusantium laboriosam cumque.",
      name: "Winson Herry",
      address: "California",
    },
    {
      _id: 2,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic non architecto nobis, adipisci recusandae voluptas accusantium laboriosam cumque.",
      name: "Winson Herry",
      address: "California",
    },
    {
      _id: 3,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic non architecto nobis, adipisci recusandae voluptas accusantium laboriosam cumque.",
      name: "Winson Herry",
      address: "California",
    },
  ];

  const testimonialData = Array.isArray(data) ? data : fallbackData;

  return (
    <section className="py-20 container mx-auto px-4" id="reviewsContaints">
      <FadeIn>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h5 className="text-cyan-400 font-bold uppercase tracking-wide">
              Testimonial
            </h5>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              What Our Patients <br /> Says
            </h1>
          </div>
          <div className="hidden md:block">
            {/* Quote icon or decoration could go here */}
            <span className="text-9xl text-cyan-200 opacity-50">,,</span>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonialData.map((review, index) => (
          <FadeIn key={review._id} delay={index * 0.2}>
            <TestimonialDetails testimonial={review} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
