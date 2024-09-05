import React from "react";
import "../styles/Button.css";

function Button({ name, onClick, active, className, imageSrc, altText }) {
  return (
    <div>
      <button
        className={`button ${className} ${active ? "active" : "inactive"}`}
        onClick={onClick}
      >
        {imageSrc ? <img width = "30%" src={imageSrc} alt={altText || name} /> : name }
      </button>
    </div>
  );
}

export default Button;