import React from "react";
import "../styles/Button.css";

function Button({ name, onClick, active, className, imageSrc, altText, disabled }) {
  return (
    <div>
      <button
        className={`button ${className} ${active ? "active" : "inactive"}`}
        onClick={onClick} disabled={disabled}
      >
        {imageSrc ? <img width = "50%" src={imageSrc} alt={altText || name} /> : name }
       
      </button>
    </div>
  );
}

export default Button;