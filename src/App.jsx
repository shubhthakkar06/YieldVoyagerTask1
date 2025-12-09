import { BrowserRouter, Routes, Route } from "react-router-dom";
import Connect from "./pages/Connect";
import Home from "./pages/Home";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import Users from "./pages/Users";   // ✅ ADD THIS
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Connect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />     {/* ✅ ADD THIS */}
        <Route path="/requests" element={<Requests />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
