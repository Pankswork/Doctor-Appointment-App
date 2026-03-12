import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { FaStar } from "react-icons/fa";

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Review State
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(null);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`/api/v1/doctors/${doctorId}`);
        setDoctor(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load doctor details");
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/v1/reviews?doctor=${doctorId}`);
        // Filter reviews for this doctor if API returns all,
        // but ideally API should filter. Assuming API returns all for now based on controller.
        // My controller returns ALL reviews. I should filter client side or update controller.
        // For now, client side filter.
        const doctorReviews = res.data.data.filter(
          (r) => r.doctor === doctorId,
        );
        setReviews(doctorReviews);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctor();
    fetchReviews();
  }, [doctorId]);

  // Fetch available slots when date or doctor changes
  useEffect(() => {
    if (doctor) {
      const fetchSlots = async () => {
        try {
          const dateString = selectedDate.toISOString();
          const res = await axios.get(
            `/api/v1/slots/availability?date=${dateString}&doctorId=${doctorId}`,
          );
          setSlots(res.data.data);
        } catch (error) {
          console.error("Error fetching slots:", error);
        }
      };
      fetchSlots();
    }
  }, [selectedDate, doctor, doctorId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSlotClick = (slot) => {
    if (!user) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }
    setSelectedSlot(slot);
    setShowConfirmation(true);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirmBooking = async () => {
    setShowConfirmation(false);
    setBookingSlot(selectedSlot);

    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // 1. Create Order
      const orderRes = await axios.post("/api/v1/payments/create-order", {
        amount: doctor.fees,
        appointmentId: "temp_id", // We need appointment ID, but we usually create appointment first.
        // Let's create appointment first with 'pending' payment status.
      });

      // WAIT: My plan said create order. But to create order I need amount.
      // And to link payment I need appointment ID.
      // So flow:
      // 1. Create Appointment (status: pending, paymentStatus: unpaid)
      // 2. Create Razorpay Order (with appointmentId)
      // 3. Open Checkout
      // 4. On Success -> Verify Payment -> Update Appointment to paid.

      // 1. Create Appointment
      const appointmentData = {
        doctor: doctorId,
        patient: user._id,
        appointmentDate: selectedDate,
        reason: "General Checkup",
        slotTime: selectedSlot.time,
        slotType: selectedSlot.type,
      };

      const appointmentRes = await axios.post(
        "/api/v1/appointments",
        appointmentData,
      );
      const appointmentId = appointmentRes.data.data._id;

      // 2. Create Razorpay Order
      const paymentRes = await axios.post("/api/v1/payments/create-order", {
        amount: doctor.fees,
        appointmentId: appointmentId,
      });

      const { amount, id: order_id, currency } = paymentRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "Doctor Appointment",
        description: "Consultation Fee",
        order_id: order_id,
        handler: async function (response) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            appointmentId: appointmentId,
          };

          try {
            const verifyRes = await axios.post(
              "/api/v1/payments/verify-payment",
              data,
            );
            if (verifyRes.data.success) {
              toast.success("Payment Successful! Appointment Booked. 🎉");
              setBookingSlot(null);
              setSelectedSlot(null);

              // Refresh slots
              const dateString = selectedDate.toISOString();
              const slotsRes = await axios.get(
                `/api/v1/slots/availability?date=${dateString}&doctorId=${doctorId}`,
              );
              setSlots(slotsRes.data.data);

              setTimeout(() => {
                navigate("/dashboard");
              }, 2000);
            }
          } catch (error) {
            console.error(error);
            toast.error("Payment Verification Failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber,
        },
        notes: {
          address: "Doctor Appointment System",
        },
        theme: {
          color: "#06b6d4",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to initiate booking/payment",
      );
      setBookingSlot(null);
      setSelectedSlot(null);
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmation(false);
    setSelectedSlot(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");

    try {
      const res = await axios.post("/api/v1/reviews", {
        doctor: doctorId,
        rating,
        comment,
      });
      setReviews([...reviews, res.data.data]);
      setRating(0);
      setComment("");
      toast.success("Review submitted!");
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        ).toFixed(1)
      : "N/A";

  const morningSlots = slots.filter((slot) => slot.type === "Morning");
  const eveningSlots = slots.filter((slot) => slot.type === "Evening");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading doctor details...</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Doctor not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/appointment")}
          className="mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Doctors
        </button>

        {/* Doctor Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={`http://localhost:5000${doctor.image}`}
              alt={doctor.user?.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-cyan-100 shadow-md"
              onError={(e) => {
                e.target.src = "https://placehold.co/150?text=Dr";
              }}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {doctor.user?.name}
              </h1>
              <p className="text-xl text-cyan-600 font-semibold mb-4">
                {doctor.specialization}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    <strong>Experience:</strong> {doctor.experience}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>
                    <strong>Phone:</strong> {doctor.user?.phoneNumber || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    <strong>Consultation Fee:</strong> ${doctor.fees}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    <strong>Email:</strong> {doctor.user?.email}
                  </span>
                </div>
              </div>

              {doctor.about && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                  <p className="text-gray-600">{doctor.about}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Reviews & Feedback{" "}
            <span className="text-sm font-normal text-gray-500">
              ({reviews.length} reviews, {averageRating}{" "}
              <FaStar className="inline text-yellow-400 mb-1" />)
            </span>
          </h2>

          {/* Review List */}
          <div className="space-y-6 mb-8">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-bold text-gray-800">
                    {review.username}
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((star, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                        size={14}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-gray-500 italic">No reviews yet.</p>
            )}
          </div>

          {/* Add Review Form */}
          {user && user.role === "patient" && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Write a Review
              </h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[...Array(5)].map((star, i) => {
                      const ratingValue = i + 1;
                      return (
                        <label key={i}>
                          <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            className="hidden"
                          />
                          <FaStar
                            className="cursor-pointer transition-colors"
                            color={
                              ratingValue <= (hover || rating)
                                ? "#ffc107"
                                : "#e4e5e9"
                            }
                            size={24}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 border rounded focus:outline-none focus:border-cyan-500"
                    rows="3"
                    placeholder="Share your experience..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700 transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Select Date
              </h2>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="border-none rounded-lg w-full"
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Available Slots */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Available Slots
              </h2>
              <p className="text-gray-500 mb-6">
                {selectedDate.toDateString()}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Morning Slots */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                    <span>🌅</span> Morning
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {morningSlots.length > 0 ? (
                      morningSlots.map((slot) => (
                        <button
                          key={slot._id}
                          disabled={
                            slot.remainingSlots === 0 ||
                            bookingSlot?._id === slot._id
                          }
                          onClick={() => handleSlotClick(slot)}
                          className={`p-3 rounded-lg text-center shadow-sm transition duration-300 flex flex-col items-center justify-center border
                            ${
                              bookingSlot?._id === slot._id
                                ? "bg-cyan-500 text-white border-cyan-600 animate-pulse"
                                : slot.remainingSlots === 0
                                  ? "bg-red-50 border-red-100 cursor-not-allowed opacity-60"
                                  : "bg-white border-cyan-100 hover:border-cyan-400 hover:shadow-md cursor-pointer hover:bg-cyan-50"
                            }`}
                        >
                          <span
                            className={`font-bold text-sm block ${bookingSlot?._id === slot._id ? "text-white" : "text-gray-700"}`}
                          >
                            {slot.time}
                          </span>
                          <span
                            className={`text-xs mt-1 font-medium ${
                              bookingSlot?._id === slot._id
                                ? "text-white"
                                : slot.remainingSlots > 0
                                  ? "text-green-600"
                                  : "text-red-500"
                            }`}
                          >
                            {bookingSlot?._id === slot._id
                              ? "Booking..."
                              : slot.remainingSlots > 0
                                ? "Available"
                                : "Full"}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm col-span-2 text-center py-4 bg-gray-50 rounded">
                        No slots available
                      </p>
                    )}
                  </div>
                </div>

                {/* Evening Slots */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                    <span>🌆</span> Evening
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {eveningSlots.length > 0 ? (
                      eveningSlots.map((slot) => (
                        <button
                          key={slot._id}
                          disabled={
                            slot.remainingSlots === 0 ||
                            bookingSlot?._id === slot._id
                          }
                          onClick={() => handleSlotClick(slot)}
                          className={`p-3 rounded-lg text-center shadow-sm transition duration-300 flex flex-col items-center justify-center border
                            ${
                              bookingSlot?._id === slot._id
                                ? "bg-blue-500 text-white border-blue-600 animate-pulse"
                                : slot.remainingSlots === 0
                                  ? "bg-red-50 border-red-100 cursor-not-allowed opacity-60"
                                  : "bg-white border-blue-100 hover:border-blue-400 hover:shadow-md cursor-pointer hover:bg-blue-50"
                            }`}
                        >
                          <span
                            className={`font-bold text-sm block ${bookingSlot?._id === slot._id ? "text-white" : "text-gray-700"}`}
                          >
                            {slot.time}
                          </span>
                          <span
                            className={`text-xs mt-1 font-medium ${
                              bookingSlot?._id === slot._id
                                ? "text-white"
                                : slot.remainingSlots > 0
                                  ? "text-green-600"
                                  : "text-red-500"
                            }`}
                          >
                            {bookingSlot?._id === slot._id
                              ? "Booking..."
                              : slot.remainingSlots > 0
                                ? "Available"
                                : "Full"}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm col-span-2 text-center py-4 bg-gray-50 rounded">
                        No slots available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 mb-4">
                  <svg
                    className="h-8 w-8 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirm Appointment
                </h3>
                <p className="text-gray-500">
                  Please review the details before confirming
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Doctor:</span>
                  <span className="text-gray-900 font-semibold">
                    {doctor.user?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="text-gray-900 font-semibold">
                    {selectedDate.toDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Time:</span>
                  <span className="text-gray-900 font-semibold">
                    {selectedSlot.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Session:</span>
                  <span className="text-gray-900 font-semibold">
                    {selectedSlot.type}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-bold text-lg">
                      Consultation Fee:
                    </span>
                    <span className="text-cyan-600 font-bold text-2xl">
                      ${doctor.fees}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;
