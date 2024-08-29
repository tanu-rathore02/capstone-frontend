import React, { useState } from "react";
import Button from "../components/Button";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, signupUser } from "../features/auth/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("ADMIN");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleButtonClick = (type) => {
    setUserType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userType === "ADMIN") {
      // Login as Admin
      const credentials = {
        username: email,
        password,
      };

      try {
        const result = await dispatch(loginUser(credentials)).unwrap();
        localStorage.setItem("token", result.token);
        navigate("/adminDashboard");
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else {
      // Login as User
      const credentials = {
        username: phoneNo,
        password,
      };

      try {
        const result = await dispatch(loginUser(credentials)).unwrap();
        localStorage.setItem("token", result.token);
        navigate("/adminDashboard");
      } catch (error) {
        console.error("Login failed:", error);
      }
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
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              ) : (
                <>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    required
                  />
                </>
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
              <Button name="sign-in" className="form-btn" />
            </div>
          </form>
        </div>
        <div className="signin-image"></div>
      </div>
    </div>
  );
}

export default Login;

