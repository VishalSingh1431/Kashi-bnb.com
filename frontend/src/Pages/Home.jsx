import React from 'react'
import Navbar from '../Components/Navbar'
import Slider from '../Components/Slider'

import Contact from './Contact'
import About from './About'
import Footer from '../Components/Footer' 
import Card from '../Components/Card' 
import Homestay from './Homestay' 
import Hotel from './Hotel'
import AdminBookings from './AdminBookings'
import Listings from './Listings'
import Signup from './signup'
import Login from './Login'
// import owner from './owner'
import Profile from '../Components/Profile'  
import CheckOut from '../Components/CheckOut'
// import Owner from './Owner'

const Home = () => {
  return (
    <div>

      <Navbar/>
      <Slider/>  
      <Homestay/> 
      <CheckOut/>
      {/* <Owner/> */}
      {/* <About/> */}
      {/* <Contact/> */}
      {/* <Signup/>  */}
      {/* <Login/> */}

    </div>
  )
}

export default Home
