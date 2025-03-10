import React from 'react'

const Navbar = () => {
  return (
    <div className='flex justify-around'>

       <div className=''>
        <img className='w-60 rounded-lg' src="/images\logo1.png" alt="" />
       </div>

       <div>
        <ul className='flex gap-5 '>
            <li>Home</li>
            <li>Hotels</li>
            <li>Restaurants</li>
            <li>About</li>
            <li>Add Your Business</li>
            <li>Blogs</li>
            <li>Contact</li>
        </ul>
       </div>

    </div>
  )
}

export default Navbar
