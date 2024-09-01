

// function HocWrapper(Navbar, Header) {
//   return function WrappedComponent(Component) {
//     return function HocWrapper(props) {
//       return (
//         <div>
//           <Header />
//           <Navbar />
//           <div className="fixed-content">
//             <Component {...props} />
//           </div>
//         </div>
//       );
//     };
//   };
// }

// export default HocWrapper;
import React from 'react';

function HocWrapper(Navbar, Header) {
  return function (Component) {  // Component here refers to the component that you want to wrap
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


