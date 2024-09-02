
import React from 'react';

function HocWrapper(Navbar, Header) {
  return function (Component) {  
    return function WrappedComponent(props) {
      return (
        <div>
          <Header />
          <Navbar />
          <div className="fixed-content">
            <Component {...props} />
          </div>
        </div>
      );
    };
  };
}

export default HocWrapper;


