import React from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom';


function Users() {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/addIssuance");
  }
  return (
    <div>
      {/* <Navbar/> */}
      <Button name="Add Issuance" onClick={handleButtonClick}/>
      </div>

  )
}

export default Users