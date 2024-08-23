import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Card from "../components/Card";
import "./styles/AdminDashboard.css";
import totalUsers from "../assets/totalUsers.png";
import totalBooks from "../assets/totalBooks.png";
import inHouseReaders from "../assets/inHouseReaders.png";
import issuedBooks from "../assets/issuedBooks.png";

function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <Card name="Total Users" value="120" image={totalUsers} />
      <Card name="In-house Readers" value="7" image={inHouseReaders} />
      <Card name="Total Books" value="500" image={totalBooks} />
      <Card name="Issued Books" value="45" image={issuedBooks} />
    </div>
  );
}

export default HocWrapper(Navbar, Header)(AdminDashboard);
