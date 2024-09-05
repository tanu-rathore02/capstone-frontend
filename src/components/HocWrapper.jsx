
import React from 'react';
import '../styles/HocWrapper.css'

function HocWrapper(Navbar, Header) {
  return function (Component) {  
    return function WrappedComponent(props) {
      return (
        <div className='hoc-container'>
          <div className='nav-container'>
          <Navbar />
          </div>
          <div className="header-container">
            <Header />
          </div>
          <div className='component-container'>
            <Component {...props} />
          </div>
        </div>
      );
    };
  };
}

export default HocWrapper;


