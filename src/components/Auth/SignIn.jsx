import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SocialLogin from "./SocialLogin";
import toast from "react-hot-toast";

const SignIn = ({ toggleForm }) => {
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Redirect to the page the user was trying to visit, or "/" by default
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data);
      if (result.success) {
        toast.success("Successfully Signed In");
        navigate(from, { replace: true });
      } else {
        toast.error(result.message || "Login Failed");
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
          Sign In
        </h2>

        <div className="relative mb-4">
          <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative mb-4">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            {...register("password", { required: "Password is required" })}
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
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>

      <div className="text-center text-gray-500 my-2">
        Or sign in with social platforms
      </div>
      <SocialLogin />

      <div className="text-center mt-4">
        <p className="text-gray-600">
          New here?{" "}
          <button
            type="button"
            onClick={toggleForm}
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
