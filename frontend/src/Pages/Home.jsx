import React from 'react'
import Navbar from '../Components/Navbar'
import Slider from '../Components/Slider'
import Login from './login'
import Signup from './Signup'
import Contact from './Contact'
import About from './About'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Slider/> 
      
      {/* <About/> */}
      {/* <Contact/> */}
      <Signup/> 
      {/* <Login/> */}
    </div>
  )
}

export default Home
