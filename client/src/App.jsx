import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect } from "react";
import Dashbord from "./pages/Dashbord";


function App() {
  const token = localStorage.getItem("token");

  // navigate user if token not exist
  let navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Dashbord />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
