import React, { useEffect } from "react";
import "../styles/Toast.css"; 

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`toast ${show ? "show" : ""}`}>
      {message}
    </div>
  );
};

export default Toast;
