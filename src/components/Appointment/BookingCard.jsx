import React, { useState } from "react";
import AppointmentForm from "./AppointmentForm";

const BookingCard = ({ booking, date }) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="w-full md:w-1/3 px-4 mb-8">
      <div className="bg-white p-6 shadow-lg rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
        <h5 className="text-xl font-bold text-cyan-500 mb-2">
          {booking.title}
        </h5>
        <h6 className="font-semibold text-gray-800 mb-2">{booking.time}</h6>
        <p className="text-gray-500 text-sm mb-4">
          {booking.space} SPACES AVAILABLE
        </p>

        <button
          onClick={openModal}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition duration-300 uppercase text-sm"
        >
          Book Appointment
        </button>

        <AppointmentForm
          modalIsOpen={modalIsOpen}
          appointmentName={booking.title}
          closeModal={closeModal}
          date={date}
        />
      </div>
    </div>
  );
};

export default BookingCard;
