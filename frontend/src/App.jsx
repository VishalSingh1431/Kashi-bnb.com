import { useState } from "react";
import "./App.css";
import { bg_main } from "./assets/Vars";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Slider from "./Components/Slider";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import About from "./Pages/About";
// import Signup from "./Pages/Signup";
// import Login from "./Pages/Login";
import Footer from "./Components/Footer"; // Import Footer
import HotelPage from "./Components/HotelPage";
import Activities from "./Pages/Activities";

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundImage: `url(${bg_main})` }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/activities" element={<Activities/>} />
          
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/hotel/:id" element={<HotelPage/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;