import React from "react";
import BookingCard from "./BookingCard";

const AvailableAppointments = ({ date }) => {
  // Service data - could be moved to backend later
  const services = [
    {
      _id: "1",
      title: "Teeth Orthodontics",
      time: "8:00 AM - 9:00 AM",
      space: 10,
    },
    {
      _id: "2",
      title: "Cosmetic Dentistry",
      time: "9:00 AM - 10:00 AM",
      space: 8,
    },
    {
      _id: "3",
      title: "Teeth Cleaning",
      time: "10:00 AM - 11:00 AM",
      space: 9,
    },
    {
      _id: "4",
      title: "Cavity Protection",
      time: "11:00 AM - 12:00 PM",
      space: 5,
    },
    {
      _id: "5",
      title: "Pediatric Dental",
      time: "06:00 PM - 07:00 PM",
      space: 10,
    },
    { _id: "6", title: "Oral Surgery", time: "07:00 PM - 08:00 PM", space: 10 },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-center text-3xl font-bold text-cyan-400 mb-12">
        Available Appointments on{" "}
        {date?.toDateString ? date.toDateString() : String(date)}
      </h2>
      <div className="flex flex-wrap -mx-4 justify-center">
        {services.map((booking) => (
          <BookingCard key={booking._id} booking={booking} date={date} />
        ))}
      </div>
    </section>
  );
};

export default AvailableAppointments;
