import React from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";


function AdminDashboard() {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/registerUser");
  };

  return (
    <div>
      {/* <Navbar/> */}
      <Button name="Add User" onClick={handleButtonClick}/>
    </div>
  );
}

export default AdminDashboard;
