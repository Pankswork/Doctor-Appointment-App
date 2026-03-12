import React from "react";
import ServiceDetail from "./ServiceDetail";

// Use placeholders for images if local assets aren't migrated yet
const flouride = "https://cdn-icons-png.flaticon.com/512/2908/2908188.png";
const cavity = "https://cdn-icons-png.flaticon.com/512/2810/2810935.png";
const teath = "https://cdn-icons-png.flaticon.com/512/2721/2721074.png";

const serviceData = [
  {
    name: "Fluoride Treatment",
    img: flouride,
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, quaerat?",
  },
  {
    name: "Cavity Filling",
    img: cavity,
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, quaerat?",
  },
  {
    name: "Teeth Whitening",
    img: teath,
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, quaerat?",
  },
];

import FadeIn from "../Shared/FadeIn";

const Services = () => {
  return (
    <section className="py-20" id="serviceContaint">
      <div className="text-center mb-12">
        <FadeIn>
          <h5 className="text-cyan-400 font-bold uppercase tracking-wide">
            OUR SERVICES
          </h5>
          <h2 className="text-3xl font-bold text-white">Services We Provide</h2>
        </FadeIn>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceData.map((service, index) => (
            <FadeIn key={service.name} delay={index * 0.2} direction="up">
              <ServiceDetail service={service} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
