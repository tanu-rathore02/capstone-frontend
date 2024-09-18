import React, { useState } from "react";
import Button from "../components/Button";
import "../styles/Login.css";

import { useNavigate } from "react-router-dom";
import { postRequestWithoutAuth } from "../api/ApiManager";
import { LOGIN_API } from "../api/ApiConstants";

function Login() {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("ADMIN");
  const [errors, setErrors] = useState({});
  const [activeButton, setActiveButton] = useState("ADMIN");
  const navigate = useNavigate();

  const handleButtonClick = (type) => {
    const upperType = type.toUpperCase();
    setUserType(upperType);
    setActiveButton(upperType);
    setErrors({});
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (userType === "ADMIN") {
      if (!email) {
        newErrors.email = "Email is required.";
        isValid = false;
      } else {
        let atIndex = email.indexOf('@');
        let dotIndex = email.indexOf('.');
    
        if (atIndex === -1 || dotIndex === -1 || email.slice(dotIndex) !== ".com" || dotIndex < atIndex) {
          newErrors.email = "Invalid email format. Domain must end with .com.";
          isValid = false;
        }
      }
    } else {
      if (!phoneNo) {
        newErrors.phoneNo = "Phone number is required.";
        isValid = false;
      } else if (!/^\d+$/.test(phoneNo)) {
        newErrors.phoneNo = "Phone number must contain only digits.";
        isValid = false;
      } else if (phoneNo.length < 10) {
        newErrors.phoneNo = "Phone number must be 10 digits long.";
        isValid = false;
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const encodedPassword = btoa(password);

    const credentials =
      userType === "ADMIN"
        ? { username: email, "password": encodedPassword }
        : { username: phoneNo, "password": encodedPassword };

    postRequestWithoutAuth(LOGIN_API, credentials, (response) => {
      if (response?.status === 200 || response?.status === 201) {
        const { token, id, name } = response.data; 

    
        localStorage.setItem("token", token);
        localStorage.setItem("role", userType);
        localStorage.setItem("userId", id);
        localStorage.setItem("name", name);
     
        
 

        navigate(userType === "ADMIN" ? "/adminDashboard" : "/userDashboard");
      } else if (response?.status === 400) {
        setErrors({ general: "Incorrect username or password. Please try again." });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  const handlePhoneNoChange = (e) => {
    setPhoneNo(e.target.value);
    if (errors.phoneNo) {
      setErrors((prevErrors) => ({ ...prevErrors, phoneNo: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password || errors.general) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
        general: "",
      }));
    }
  };
 return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="welcome-heading">Welcome to Book Nexus!</h1>
      </div>
      <div className="signin-content">
        <div className="signin-form">
          <div className="toggle-button">
            <Button
              name="Admin"
              onClick={() => handleButtonClick("ADMIN")}
              active={activeButton === "ADMIN"}
            />
            <Button
              name="User"
              onClick={() => handleButtonClick("USER")}
              active={activeButton === "USER"}
            />
          </div>
          <p>Sign-in to continue</p>
          <form onSubmit={handleSubmit}>
            <div className="signin-input-field">
              {userType === "ADMIN" ? (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {errors.email && (
                    <p className="error-msg">{errors.email}</p>
                  )}
                </>
              ) : (
                <>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNo}
                    onChange={handlePhoneNoChange}
                  />
                  {errors.phoneNo && (
                    <p className="errorr-msg">{errors.phoneNo}</p>
                  )}
                </>
              )}
            </div>
            <div className="signin-input-field">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && (
                <p className="error-msg">{errors.password}</p>
              )}
              {errors.general && (
                <p className="error-msg">{errors.general}</p>
              )}
            </div>
            <div className="signin-button">
              <Button name="Sign In" className="form-btn" />
            </div>
          </form>
        </div>
        <div className="signin-image"></div>
      </div>

 
    </div>
  );
}

export default Login;