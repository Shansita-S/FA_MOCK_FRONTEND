import { createContext, useReducer, useEffect } from "react";
import { authReducer, authInitialState } from "../reducer/authReducer.js";
import axios from "axios";

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  // Sync token with axios defaults on mount or token change
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [state.token]);

  const login = async (username, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user },
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check credentials.";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        user: state.user,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
