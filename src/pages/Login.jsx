import React, { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";


function Login() {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("ADMIN");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleButtonClick = (type) => {
    setUserType(type);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (userType === "Admin") {
      // Validate email
      if (!email) {
        newErrors.email = "Email is required.";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Invalid email format.";
        isValid = false;
      }
    } else {
    
      if (!phoneNo) {
        newErrors.phoneNo = "Phone number is required.";
        isValid = false;
      } else if (!/^\d+$/.test(phoneNo)) {
        newErrors.phoneNo = "Phone number must contain only digits.";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const credentials = userType === "Admin" ? { username: email, password } : { username: phoneNo, password };

    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      localStorage.setItem("token", result.token);
      navigate("/adminDashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="welcome-heading">Welcome Guest!</h1>
      </div>
      <div className="signin-content">
        <div className="signin-form">
          <div className="toggle-button">
            <Button
              name="Admin"
              onClick={() => handleButtonClick("Admin")}
              active={userType === "Admin"}
            />
            <Button
              name="User"
              onClick={() => handleButtonClick("User")}
              active={userType === "User"}
            />
          </div>
          <p>Sign-in to continue</p>
          <form onSubmit={handleSubmit}>
            <div className="signin-input-field">
              {userType === "Admin" ? (
                <>
                  <InputField
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </>
              ) : (
                <>
                  <InputField
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                  />
                  {errors.phoneNo && <p className="error-message">{errors.phoneNo}</p>}
                </>
              )}
            </div>
            <div className="signin-input-field">
              <InputField
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
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


