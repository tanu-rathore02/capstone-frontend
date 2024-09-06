// import React, { useState } from "react";
// import Button from "../components/Button";
// import "../styles/Login.css";
// import Toast from "../components/Toast";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { loginUser } from "../features/auth/authSlice";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [phoneNo, setPhoneNo] = useState("");
//   const [password, setPassword] = useState("");
//   const [userType, setUserType] = useState("ADMIN");
//   const [errors, setErrors] = useState({});
//   const [activeButton, setActiveButton] = useState("USER"); 
//   const [toastMessage, setToastMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleButtonClick = (type) => {
//     setUserType(type).toUpperCase();
//     setActiveButton(type).toUpperCase();
//   };

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = {};

//     if (userType === "ADMIN") {
//       if (!email) {
//         newErrors.email = "Email is required.";
//         isValid = false;
//       } else if (!/\S+@\S+\.\S+/.test(email)) {
//         newErrors.email = "Invalid email format.";
//         isValid = false;
//       }
//     } else {
//       if (!phoneNo) {
//         newErrors.phoneNo = "Phone number is required.";
//         isValid = false;
//       } else if (!/^\d+$/.test(phoneNo)) {
//         newErrors.phoneNo = "Phone number must contain only digits.";
//         isValid = false;
//       }
//     }

//     if (!password) {
//       newErrors.password = "Password is required.";
//       isValid = false;
//     } else if (password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters long.";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     const credentials =
//       userType === "ADMIN"
//         ? { username: email, password }
//         : { username: phoneNo, password };

//     try {
//       const result = await dispatch(loginUser(credentials)).unwrap();

//       localStorage.setItem("token", result.token);
//       localStorage.setItem("role", userType.toUpperCase());
//       setToastMessage("Login successful");
//       setShowToast(true);

//       setTimeout(() => {
//         setShowToast(false);
//         if (userType === "ADMIN") {
//           navigate("/adminDashboard");
//         } else {
//           navigate("/userDashboard");
//         }
//       }, 3000);
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
    
//   };

//   return (
//     <div className="home-container">
//       <div className="home-header">
//         <h1 className="welcome-heading">Welcome Guest!</h1>
//       </div>
//       <div className="signin-content">
//         <div className="signin-form">
//           <div className="toggle-button">
//             <Button
//               name="Admin"
//               onClick={() => handleButtonClick("ADMIN")}
//               active={activeButton === "ADMIN"}
//             />
//             <Button
//               name="User"
//               onClick={() => handleButtonClick("USER")}
//               active={activeButton === "USER"}
//             />
//           </div>
//           <p>Sign-in to continue</p>
//           <form onSubmit={handleSubmit}>
//             <div className="signin-input-field">
//               {userType === "ADMIN" ? (
//                 <>
//                   <input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                   {errors.email && (
//                     <p className="error-message">{errors.email}</p>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <input
//                     type="tel"
//                     placeholder="Enter your phone number"
//                     value={phoneNo}
//                     onChange={(e) => setPhoneNo(e.target.value)}
//                   />
//                   {errors.phoneNo && (
//                     <p className="error-message">{errors.phoneNo}</p>
//                   )}
//                 </>
//               )}
//             </div>
//             <div className="signin-input-field">
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               {errors.password && (
//                 <p className="error-message">{errors.password}</p>
//               )}
//             </div>
//             <div className="signin-button">
//               <Button name="Sign In" className="form-btn" />
//             </div>
//           </form>
//         </div>
//         <div className="signin-image"></div>
//       </div>

//       <Toast
//         message={toastMessage}
//         show={showToast}
//         onClose={() => setShowToast(false)}
//       />
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import Button from "../components/Button";
import "../styles/Login.css";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("ADMIN");
  const [errors, setErrors] = useState({});
  const [activeButton, setActiveButton] = useState("USER"); 
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleButtonClick = (type) => {
    const upperType = type.toUpperCase(); 
    setUserType(upperType); 
    setActiveButton(upperType); 
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (userType === "ADMIN") {
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
  
    const credentials =
      userType === "ADMIN"
        ? { username: email, password }  
        : { username: phoneNo, password };  
  
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      
      if (result) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", userType); 
        setToastMessage("Login successful");
        setShowToast(true);
  
        setTimeout(() => {
          setShowToast(false);
          navigate(userType === "ADMIN" ? "/adminDashboard" : "/userDashboard");
        }, 2000);
      }
    } catch (error) {
      if (error.errorCode === 'INTERNAL_SERVER_ERROR'){
        setErrors("Username and Password doesn't match");
      }
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email}</p>
                  )}
                </>
              ) : (
                <>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                  />
                  {errors.phoneNo && (
                    <p className="error-message">{errors.phoneNo}</p>
                  )}
                </>
              )}
            </div>
            <div className="signin-input-field">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
            <div className="signin-button">
              <Button name="Sign In" className="form-btn" />
            </div>
          </form>
        </div>
        <div className="signin-image"></div>
      </div>

      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Login;

