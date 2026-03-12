import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import toast from "react-hot-toast";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "90%",
    padding: "0",
    borderRadius: "10px",
    border: "none",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

Modal.setAppElement("#root");

const AppointmentForm = ({
  modalIsOpen,
  appointmentName,
  closeModal,
  date,
  slot,
  selectedDoctor: doctorProp, // Receive doctor from props
}) => {
  const { user } = useContext(AuthContext);
  // Fetch doctors from new API
  const { data: doctors } = useFetch("/api/v1/doctors");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorProp || null);

  // Pre-select doctor if provided
  React.useEffect(() => {
    if (doctorProp) {
      setValue("doctor_id", doctorProp._id);
      setSelectedDoctor(doctorProp);
    }
  }, [doctorProp, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Construct payload matching new Appointment schema
    const appointmentData = {
      doctor: data.doctor_id,
      patient: user._id, // Assumes user object has _id
      appointmentDate: date, // Send date object or ISO string
      reason: appointmentName, // Using service title as reason
      slotTime: slot.time,
      slotType: slot.type,
      // username, phone, email, gender, age, weight are not in main Appointment schema
      // but could be part of patient profile update or separate meta.
      // For now, we only send required fields.
    };

    try {
      await axios.post("/api/v1/appointments", appointmentData);
      closeModal();
      toast.success("Successfully Appointment Submitted");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Appointment Modal"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-500">{appointmentName}</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <p className="text-center text-gray-500 mb-6 font-medium">
          On {date.toDateString()}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Display user info (read-only or pre-filled) */}
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
            <p>
              <strong>Patient:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
          </div>

         
            
          {errors.doctor_id && (
            <span className="text-red-500 text-sm">
              {errors.doctor_id.message}
            </span>
          )}

          {selectedDoctor && (
            <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-100">
              <h4 className="font-semibold text-cyan-700 mb-2">
                Doctor Details
              </h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Experience:</span>{" "}
                  {selectedDoctor.experience}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedDoctor.user?.phoneNumber || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Fees:</span> $
                  {selectedDoctor.fees}
                </p>
              </div>
            </div>
          )}

          {/* Additional fields if needed, e.g. specific problem description */}

          <div className="text-right mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-2 px-6 rounded shadow hover:shadow-lg transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AppointmentForm;
