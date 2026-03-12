import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    if (state.user?.token) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${state.user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [state.user]);

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/api/v1/auth/login", credentials);
      if (res.data.success) {
        // Combine user data and token
        const userData = { ...res.data.data, token: res.data.token };
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        return { success: true };
      }
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response?.data?.message || "Login failed",
      });
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    dispatch({ type: "REGISTER_START" });
    try {
      const res = await axios.post("/api/v1/auth/register", userData);
      // Register usually requires login afterwards or returns token.
      // Our backend returns { success: true, message: '...' } but no token on register for security/flow reasons usually,
      // but let's check our controller.
      // AuthController.register returns user object but NO token.
      // So we should redirect to login or auto-login.
      // For simplicity, let's just dispatch success but keep user null or let component handle it.
      // Actually, better to just return success and let component redirect.
      dispatch({ type: "REGISTER_SUCCESS", payload: null });
      // WAIT: REGISTER_SUCCESS sets user to payload. If payload is null, user is null. Correct.
      return { success: true };
    } catch (err) {
      dispatch({
        type: "REGISTER_FAILURE",
        payload: err.response?.data?.message || "Registration failed",
      });
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
