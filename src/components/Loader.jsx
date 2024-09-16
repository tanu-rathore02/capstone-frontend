import React from 'react';
import '../styles/Loader.css';
import loader from '../assets/loader.gif';

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={loader} alt="Loading..." className="loader-gif" />
    </div>
  );
};
export default Loader;