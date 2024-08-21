import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";


function AdminDashboard() {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/registerUser");
  };

  return (
    <div>
      <Button name="Add User" onClick={handleButtonClick}/>
    </div>
  );
}

export default HocWrapper(Navbar, Header)(AdminDashboard);
