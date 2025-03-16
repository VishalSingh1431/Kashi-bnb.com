import { useState } from 'react' 
import './App.css'
import { bg_main } from './assets/Vars'
import Navbar from './Components/Navbar'
import Slider from './Components/Slider'
import Contact from './Pages/Contact' 
// https://themewagon.github.io/direngine/index.html
function App() { 

  return (
    <>
       <Navbar/>
       <Slider/>
       <Contact/>
    </>
  )
}

export default App
