import { useState } from "react";
import "./App.css";
import { bg_main } from "./assets/Vars";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Slider from "./Components/Slider";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Footer from "./Components/Footer"; // Import Footer
import HotelPage from "./Components/HotelPage";
import Activities from "./Pages/Activities";
import Listings from "./Pages/Listings";
import Signup from "./Pages/signup";
import Login from "./Pages/Login";
import Profile from "./Components/Profile"; 
function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundImage: `url(${bg_main})` }}>
        {/* <Navbar /> */}
        <Routes>

          
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/activities" element={<Activities/>} />
          <Route path="/add-listing" element={<Listings/>} />
          
          <Route path="/profile" element={<Profile/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hotel/:id" element={<HotelPage/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
