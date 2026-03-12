import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const AddDoctor = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Creating doctor...");
    try {
      // 1. Create User
      // Default password for new doctors
      const defaultPassword = "doctorPassword123";

      const userRes = await axios.post("/api/v1/auth/register", {
        name: data.name,
        email: data.email,
        password: defaultPassword,
        role: "doctor",
        phoneNumber: data.phoneNumber,
        address: data.address, // Optional
      });

      // 2. Create Doctor Profile
      const userId = userRes.data.data._id;

      // 2. Create Doctor Profile with Image
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("specialization", data.specialization);
      formData.append("experience", data.experience);
      formData.append("fees", data.fees);
      formData.append("about", data.about);
      formData.append("image", data.image[0]); // Append the first file

      await axios.post("/api/v1/doctors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Doctor added successfully!", { id: toastId });
      reset(); // Reset form
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to add doctor",
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Add New Doctor
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Simple Password Info */}
        <div className="bg-blue-50 text-blue-800 p-4 rounded text-sm mb-6">
          <p>
            New doctors will be created with the default password:{" "}
            <strong>doctorPassword123</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Dr. John Doe"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="doctor@example.com"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number
            </label>
            <input
              {...register("phoneNumber", { required: "Phone is required" })}
              type="tel"
              placeholder="+1 234 567 890"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Professional Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Specialization
            </label>
            <select
              {...register("specialization", {
                required: "Specialization is required",
              })}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
            >
              <option value="">Select Specialization</option>
              <option value="Teeth Orthodontics">Teeth Orthodontics</option>
              <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
              <option value="Teeth Cleaning">Teeth Cleaning</option>
              <option value="Cavity Protection">Cavity Protection</option>
              <option value="Pediatric Dental">Pediatric Dental</option>
              <option value="Oral Surgery">Oral Surgery</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Cardiology">Cardiology</option>
            </select>
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">
                {errors.specialization.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Experience (Years/Detail)
            </label>
            <input
              {...register("experience", {
                required: "Experience is required",
              })}
              type="text"
              placeholder="e.g. 5 Years"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Profile Picture
            </label>
            <input
              {...register("image", { required: "Image is required" })}
              type="file"
              accept="image/*"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Consultation Fee using $
            </label>
            <input
              {...register("fees", { required: "Fees is required" })}
              type="number"
              min="0"
              placeholder="e.g. 100"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            {errors.fees && (
              <p className="text-red-500 text-sm mt-1">{errors.fees.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            About / Bio
          </label>
          <textarea
            {...register("about")}
            rows="4"
            placeholder="Short bio about the doctor..."
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-70 transform hover:-translate-y-1"
          >
            {isSubmitting ? "Creating Profile..." : "Add Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
