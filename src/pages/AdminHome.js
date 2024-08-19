import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";
import "./styles/AdminHome.css";

function AdminHome() {
  const navigate = useNavigate();

  const handleButtonClick = (userType) => {
    navigate("/login", { state: { userType } });
  };

  return (
    <div className="container">
      <header className="header">
        <Logo />
        <h1 className="welcome-heading">Welcome Guest!</h1>
        <div className="button-right">
          <Button name="Admin" onClick={() => handleButtonClick("Admin")} />
          <Button name="User" onClick={() => handleButtonClick("User")} />
        </div>
      </header>
      <div className="content">
        <h1 className="heading">Elevate your Managing Experience</h1>
        <h4 className="paragraph">
          Transform your library into a beacon of efficiency with Shelfvault,
          the smart, stylish way to manage your collection. Seamlessly organize,
          track, and connect readers with the resources they crave—all while
          enjoying an intuitive, privacy-first platform.
        </h4>
      </div>
    </div>
  );
}

export default AdminHome;
