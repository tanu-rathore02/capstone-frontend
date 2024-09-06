import React, { useState, useEffect} from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import Card from "../components/Card";
import "../styles/AdminDashboard.css";
import TableComponent from "../components/TableComponent";
import totalUsers from "../assets/totalUsers.png";
import totalBooks from "../assets/totalBooks.png";
import inHouseReaders from "../assets/inHouseReaders.png";
import issuedBooks from "../assets/issuedBooks.png";
import { Link } from "react-router-dom";
import axios from "axios";


function AdminDashboard({showPagination = false}) {

  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [reader, setReader] = useState(0);
  const [data, setData] = useState([]);


  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/user-count", {
        headers: {
          Authorization: token,
        },
      });
      setUserCount(response.data);
    } catch (error) {
      console.error("Error fetching users count", error);
    }
  }

  const fetchInHouseReaders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/issuances/type/count", {
        headers: {
          Authorization: token,
        },
      });
      setReader(response.data);
    } catch (error) {
      console.error("Error fetching users count", error);
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/categories/categoryCount", {
        headers: {
          Authorization: token,
        },
      });
      setCategoryCount(response.data);
    } catch (error) {
      console.error("Error fetching categories count", error);
    }
  }

const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/books/title-count", {
        headers: {
          Authorization: token,
        },
      });
      setBookCount(response.data);
    } catch (error) {
      console.error("Error fetching books count", error);
    }
  }
  useEffect( () => {
    fetchBooks();
    fetchUsers();
    fetchCategories();
    fetchInHouseReaders();
    
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/users`, {
        headers: {
          Authorization: token,
        },
        params: {
          page: 0,
          size: 4,
          sortBy: "id",
          sortDir: "asc",
          search:  "",
        },
      });

      setData(
        response.data.content.map((user, index) => ({
          sno: index + 1,
          id: user.id,
          name: user.name,
          mobileNumber: user.mobileNumber,
          email: user.email,
          role: user.role,
          password: user.password,
        }))
      );
      console.log("data:", data);
      
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { header: "S.no.", accessor: "sno" },
    { header: "Name", accessor: "name" },
    { header: "Mobile Number", accessor: "mobileNumber" },
    { header: "Email", accessor: "email" },
  ];

  return (
    <div className="dashboard-container">
      <div className="cards-container">
        <Card name="Total Users" value={userCount} image={totalUsers} />
        <Card name="In-house Readers" value={reader} image={inHouseReaders} />
        <Card name="Total Categories" value={categoryCount} image={totalBooks} />
        <Card name="Total Books" value={bookCount} image={issuedBooks} />
      </div>
      <h2 className="heading">Registered Users</h2>
      {/* <CategoryTable showPagination={false} /> */}
      <TableComponent columns={columns} data={data}/>
      <Link  to='/users'>Browse all users</Link>
    </div>
  );
}

export default HocWrapper(Navbar, Header)(AdminDashboard);
