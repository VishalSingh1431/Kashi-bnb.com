import { useState } from "react";
import "./App.css";
import { bg_main } from "./assets/Vars";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Slider from "./Components/Slider";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Footer from "./Components/Footer"; 
import HotelPage from "./Components/HotelPage";
import Activities from "./Pages/Activities";
import Listings from "./Pages/Listings";
import Signup from "./Pages/signup";
import Login from "./Pages/Login";
import Profile from "./Components/Profile"; 
import Owner from "./Pages/owner";
import Tourist from "./Pages/Tourist";
import Checkout from './Pages/Checkout';
import NumberForm from "./Components/NumberForm";
 
function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: '#f3eadb' }}>
        <Navbar />
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/number" element={<NumberForm/>} />
          <Route path="/about" element={<About />} />
          <Route path="/activities" element={<Activities/>} />
          <Route path="/add-listing" element={<Listings/>} />
          
          <Route path="/profile" element={<Profile/>} />
          <Route path="/owner" element={<Owner/>} />
          <Route path="/tourist" element={<Tourist/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hotel/:id" element={<HotelPage/>} />
          <Route path="/checkout/:id" element={<Checkout />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
