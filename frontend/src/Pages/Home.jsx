import React from 'react'
import Navbar from '../Components/Navbar'
import Slider from '../Components/Slider'
import Login from './Login'
import Signup from './signup'
import Contact from './Contact'
import About from './About'
import Footer from '../Components/Footer' 
import Card from '../Components/Card' 
import Homestay from './Homestay' 
import Hotel from './Hotel'
import AdminBookings from './AdminBookings'
import Listings from './Listings'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Slider/>  
      <Homestay/> 
      <Hotel/>
      <AdminBookings/>
      <Listings/>
      {/* <About/> */}
      {/* <Contact/> */}
      {/* <Signup/>  */}
      <Login/>
    </div>
  )
}

export default Home
