
import React from 'react';
import '../styles/InputField.css'; 

function InputField({ type, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="text-input"
    />
  );
}

export default InputField;
