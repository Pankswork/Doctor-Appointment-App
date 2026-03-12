import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const SocialLogin = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        dispatch({ type: "LOGIN_START" });

        // Validate with backend using access token
        const backendRes = await axios.post("/api/v1/auth/google", {
          accessToken: tokenResponse.access_token,
        });

        if (backendRes.data.success) {
          const userData = {
            ...backendRes.data.data,
            token: backendRes.data.token,
          };
          dispatch({ type: "LOGIN_SUCCESS", payload: userData });
          toast.success("Successfully logged in with Google!");
          navigate(from, { replace: true });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "LOGIN_FAILURE",
          payload: err.message || "Google Login failed",
        });
        toast.error("Google Login failed");
      }
    },
    onError: () => {
      toast.error("Google Login Failed");
    },
  });

  return (
    <div className="flex justify-center gap-2 my-2">
      <button
        onClick={() => googleLogin()}
        className="p-2 border rounded-full text-red-500 hover:bg-gray-100 transition-colors"
      >
        <FcGoogle size={30} />
      </button>
    </div>
  );
};

export default SocialLogin;
