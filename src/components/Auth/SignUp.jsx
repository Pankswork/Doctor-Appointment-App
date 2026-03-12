import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import SocialLogin from "./SocialLogin";
import toast from "react-hot-toast";

const SignUp = ({ toggleForm }) => {
  const { register: registerFunc } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registerFunc({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "patient", // Default role
        phoneNumber: data.phoneNumber,
      });

      if (result.success) {
        toast.success("Successfully Signed Up! Please login.");
        toggleForm(); // Switch to login view
      } else {
        toast.error(result.message || "Registration Failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">
          Sign Up
        </h2>

        <div className="relative mb-4">
          <FaUser className="absolute top-3 left-3 text-gray-400" />
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            placeholder="Name"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="relative mb-4">
          <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative mb-4">
          <FaPhone className="absolute top-3 left-3 text-gray-400" />
          <input
            {...register("phoneNumber", {
              required: "Phone Number is required",
            })}
            type="text"
            placeholder="Phone Number"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="relative mb-4">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      <div className="text-center text-gray-500 my-2">
        Or sign up with social platforms
      </div>
      <SocialLogin />

      <div className="text-center mt-4">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={toggleForm}
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
