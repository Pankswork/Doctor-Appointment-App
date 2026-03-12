import React, { useState } from "react";
import SignIn from "../components/Auth/SignIn";
import SignUp from "../components/Auth/SignUp";
import { Toaster } from "react-hot-toast";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 flex overflow-hidden relative">
        {/* We can add the sliding panel animation later if desired, for now simple toggle */}
        <div className="w-full">
          {isSignUp ? (
            <SignUp toggleForm={toggleForm} />
          ) : (
            <SignIn toggleForm={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
