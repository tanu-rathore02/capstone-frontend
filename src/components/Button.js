import React from 'react';
import './styles/Button.css'

function Button( {name, onClick}) {
  return (
    <div>
      <button className="button" onClick={onClick}>{name}</button>
    </div>
  );
}

export default Button;
