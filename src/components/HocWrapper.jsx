import React, { useState } from "react";
import "../styles/HocWrapper.css";
import Loader from "./Loader";

function HocWrapper(Navbar, Header) {
  return function (Component) {
    return function WrappedComponent(props) {
      const role = localStorage.getItem("role");
      const [loading, setLoading] = useState(false);
      return (
        <div className="hoc-container">
          <div className="nav-container">
            <Navbar role={role} />
          </div>
          <div className="header-container">
            <Header />
            {loading && <Loader />}
            <Component {...props} setLoading={setLoading} />
          </div>
          <div className="component-container"></div>
        </div>
      );
    };
  };
}

export default HocWrapper;
