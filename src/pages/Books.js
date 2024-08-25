import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Books() {
  return <div></div>;
}

export default HocWrapper(Navbar, Header)(Books);
