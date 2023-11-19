import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, signupUser, whoami } from "../api";
import Loader from "../components/Loader";
import { requestHandler } from "../utils";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Create a context to manage authentication-related data and functions
const AuthContext = React.createContext({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

// Create a hook to access the AuthContext
const useAuth = () => useContext(AuthContext);

// Create a component that provides authentication-related data and functions
const AuthProvider = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      await requestHandler(
        async () => await loginUser(data),
        setIsLoading,
        (res) => {
          const token = res.authToken;
          toast.success("Login successful ✅");
          localStorage.setItem("token", token);
          navigate("/");
        },
        alert
      );
    } catch (error) {
      // Handle the error here
      console.log(error);
    }
  };

  const signup = async (data) => {
    try {
      await requestHandler(
        async () => await signupUser(data),
        setIsLoading,
        (res) => {
          const token = res.authToken;
          toast.success("Signup successful ✅");
          localStorage.setItem("token", token);
          navigate("/");
        },
        alert
      );
    } catch (error) {
      // Handle the error here
      console.log(error);
    }
  };
  
  const logout = async () => {
    try {
     setIsLoading(true)
     const token = localStorage.getItem('token')
     if (token) {
      localStorage.clear()
      navigate("/login")
      toast.success("Logout successful ✅");
     }
    } catch (error) {
      setIsLoading(true)
      console.log(error)      
    } finally {
      setIsLoading(false)
    }
  };

  

  // Get user
  useEffect(() => {
    if (token) {
      const getuser = async () => {
        await requestHandler(
          async () => await whoami(),
          setIsLoading,
          (res) => {
            const { data } = res;
            setUser(data || []);
          },
          alert
        );
      };
      getuser();
    }
  }, [token]);

  // Provide authentication-related data and functions through the context
  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      <Toaster theme="dark" position="top-right" expand={true} />
      {isLoading ? <Loader /> : props.children}
    </AuthContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { AuthContext, AuthProvider, useAuth };
