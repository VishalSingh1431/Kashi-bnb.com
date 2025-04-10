import React from 'react'
import axios from 'axios';
import { BACKEND } from '../assets/Vars';
const token=localStorage.getItem("token");
const user=JSON.parse(localStorage.getItem("user"));
const response = await axios.get(`${BACKEND}/api/v1/user/profile/id/${user.id}`, {
    headers: {
      'Authorization': token
    }
  });
  console.log(response);
   
const Profile = () => {
  return (
    <div>
      
    </div>
  )
}

export default Profile
