import React from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom';

function Categories() {
  
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/addCategory");
  };
  return (
    <div>Categories
      {/* <Navbar/> */}
      <Button name="Add Category" onClick={handleButtonClick}/>
    </div>
  )
}

export default Categories