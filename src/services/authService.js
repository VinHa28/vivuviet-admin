import axios from "../lib/axios";

export const login = async (email, password) => {
  try {
    const response = await axios.post("/admin/login", { email, password });

    // Handle new standardized response format
    const responseData = response.data.data || response.data;

    if (responseData.token) {
      localStorage.setItem("accessToken", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
    }
    return responseData;
  } catch (error) {
    console.error("AuthService: Login failed:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr || userStr === "undefined" || userStr === "null") {
      return null;
    }
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("accessToken");
};
