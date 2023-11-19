import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3005",
  withCredentials: true, // Add this line
  timeout: 120000,
});

apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = localStorage.getItem("token");
    // Set authorization header with bearer token
    config.headers["auth-token"] = `${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// API functions for different actions
const loginUser = (data) => {
  return apiClient.post("/user/login", data, {
    withCredentials: true, // Add this line
  });
};

// API functions for different actions
const signupUser = (data) => {
  return apiClient.post("/user/createuser", data, {
    withCredentials: true, // Add this line
  });
};

const whoami = () => {
  return apiClient.get("/user/whoami", {
    withCredentials: true, // Add this line
  });
};

export {
  whoami,
  loginUser,
  signupUser,
};
