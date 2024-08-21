import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function Books() {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/addBook");
  }
  return (
    <div>
      {/* <Navbar/>Books */}
      <Button name="Add Book" onClick={handleButtonClick}/>
      </div>
  )
}

export default Books