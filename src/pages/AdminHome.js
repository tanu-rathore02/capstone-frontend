import React, { useState } from "react";
import Button from "../components/Button";
import Logo from "../components/Logo";
import './styles/AdminHome.css';
import { useNavigate } from 'react-router-dom'

function AdminHome() {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Admin");
  
  const navigate = useNavigate();

  const handleButtonClick = (type) => {
    setUserType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === 'Admin') {
      console.log("Email:", email);
    } else {
      console.log("Phone Number:", phoneNo);
    }
    console.log("Password:", password);
    navigate('/adminDashboard')
  };

  return (
    <div className="home-container">
       <Logo className="logo" />
      <div className="header">

        <h1 className="welcome-heading">Welcome Guest!</h1>
      </div>
      {/* <div className="signin-container"> */}
        <div className="signin-content">
          <div className="signin-form">
            <div className="toggle-button">
              <Button 
                name="Admin" 
                onClick={() => handleButtonClick("Admin")} 
                className={userType === "Admin" ? "button active" : "button inactive"} 
              />
              <Button 
                name="User" 
                onClick={() => handleButtonClick("User")} 
                className={userType === "User" ? "button active" : "button inactive"} 
              />
            </div>
            <p>Sign-in to Continue</p>
            <form onSubmit={handleSubmit}>
              <div className="signin-input-field">
                {userType === "Admin" ? (
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                ) : (
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    required
                  />
                )}
              </div>
              <div className="signin-input-field">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="signin-button">
                <Button name="Sign-in" />
              </div>
            </form>
          </div>
          <div className="signin-image"></div>
        </div>
      </div>
    // </div>
  );
}

export default AdminHome;
