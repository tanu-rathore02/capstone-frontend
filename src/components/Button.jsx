import React from "react";
import "../styles/Button.css";

function Button({ name, onClick, active, className }) {
  return (
    <div>
      <button
        className={`button ${className} ${active ? "active" : "inactive"}`}
        onClick={onClick}
      >
        {name}
      </button>
    </div>
  );
}

export default Button;
