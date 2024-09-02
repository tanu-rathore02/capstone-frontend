import React from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import HocWrapper from "../components/HocWrapper";


function Contact() {
  return (
    <div>
       Contact
    </div>
  );
}

export default HocWrapper(Navbar, Header)(Contact);
