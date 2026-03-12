import React from "react";
import { FaClock, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import InfoCard from "./InfoCard";

const infosData = [
  {
    title: "Opening Hours",
    description: "We are open 7 days",
    icon: FaClock,
    background: "primary",
  },
  {
    title: "Visit Our Location",
    description: "Brooklyn, NY 10003 USA",
    icon: FaMapMarkerAlt,
    background: "dark",
  },
  {
    title: "Call us now",
    description: "+15697854124",
    icon: FaPhoneAlt,
    background: "primary",
  },
];

const BusinessInfo = () => {
  return (
    <section className="container mx-auto px-4 -mt-10 md:-mt-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {infosData.map((info) => (
          <InfoCard info={info} key={info.title} />
        ))}
      </div>
    </section>
  );
};

export default BusinessInfo;
