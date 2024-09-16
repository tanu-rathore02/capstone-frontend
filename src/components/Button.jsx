import React from "react";
import "../styles/Button.css";

function Button({ name, onClick, active, className, imageSrc, altText, disabled, tooltip }) {


  return (
    <div>
      <button
        className={`button ${className} ${active ? "active" : "inactive"}`}
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
      
      
      >
        {imageSrc ? <img width = "50%" src={imageSrc} alt={altText || name} /> : name }
       
      </button>
    </div>
  );
}

export default Button;