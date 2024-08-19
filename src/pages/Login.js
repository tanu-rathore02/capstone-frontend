
import React, { useState } from 'react';
import Button from '../components/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Login.css';

function Login() {
  const location = useLocation();
  const { userType } = location.state; 

  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  let template;
  if(userType === 'Admin'){
    template = <input 
    type='email' 
    placeholder='Enter your email' 
    value={email} 
    onChange={(e) => setEmail(e.target.value)} 
    required
  />
  } else {
    template = <input 
    type='number' 
    placeholder='Enter your phone number' 
    value={phoneNo} 
    onChange={(e) => setPhoneNo(e.target.value)} 
    required
  />
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Phone number:', phoneNo);
    // post api
    navigate("/adminDashboard");
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">{`Login as ${userType}`}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-container">
            {template}
          </div>
          <div className="input-container">
            <input 
              type='password' 
              placeholder='Enter your password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <Button name="Login" className="login-button" />
        </form>
      </div>
    </div>
  );
}

export default Login;
