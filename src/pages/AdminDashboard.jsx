import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Card from "../components/Card";
import "../styles/AdminDashboard.css";
import totalUsers from "../assets/totalUsers.png";
import totalBooks from "../assets/totalBooks.png";
import inHouseReaders from "../assets/inHouseReaders.png";
import issuedBooks from "../assets/issuedBooks.png";
import CategoryTable from "../components/CategoryTable";
import BooksTable from "../components/BooksTable";
import { Link } from 'react-router-dom';
import axios from "axios";

function AdminDashboard() {
  const [data, setData] = useState({
    totalUsers: 0,
    inHouseReaders: 0,
    totalBooks: 0,
    issuedBooks: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const authHeader = token;

      
        const userCountResponse = await axios.get('http://localhost:8080/api/user-count')
    
        const userCount = userCountResponse.data; 

        // Fetch books count
        const booksCountResponse = await axios.get('http://localhost:8080/api/book/title-count', {
          headers: {
            Authorization: authHeader,
          },
        });
        const bookCount = booksCountResponse.data; 

        setData(prevData => ({
          ...prevData,
          totalUsers: userCount,
          totalBooks: bookCount,
          
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="cards-container">
        <Card name="Total Users" value={totalUsers.user} image={totalUsers} />
        <Card name="In-house Readers" value={data.inHouseReaders} image={inHouseReaders} />
        <Card name="Total Books" value={data.totalBooks} image={totalBooks} />
        <Card name="Issued Books" value={data.issuedBooks} image={issuedBooks} />
      </div>
      <h2 className="heading">Categories</h2>
      <CategoryTable showPagination={false} />
      <Link to="/categories">Browse all categories</Link>
      
    </div>
  );
}

export default HocWrapper(Navbar, Header)(AdminDashboard);
