import React, { useState } from "react";
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/Login.css";


function Login() {
  const location = useLocation();
  const { userType } = location.state;

  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  let template;
  if (userType === "Admin") {
    template = (
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    );
  } else {
    template = (
      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
        required
      />
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Phone number:", phoneNo);
    // post api
    navigate("/adminDashboard");
  };

  return(
    <div className="siginin-container">
      <div className="signin-content">
        <div className="signin-form">
          <h2>{`Welcome ${userType}!`}</h2>
          <p>Sign in to Continue</p>
          <form>
            <div className="signin-input-field">
              {template}
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
            <Button
              name="Sign-in"
              className="Signin-button"
              onClick={(e) => handleSubmit(e)}
            />
          </form>
        </div>
        <div className="signin-image"></div>
      </div>
    </div>
  );
}

export default Login;
