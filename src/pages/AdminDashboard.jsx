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

import { getRequest } from "../api/ApiManager";
import { GET_BOOK_COUNT, GET_USER_COUNT, GET_CATEGORY_COUNT, GET_INHOUSE_READER_COUNT,GET_USER } from "../api/ApiConstants"; 

function AdminDashboard({showPagination = false}) {

  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [reader, setReader] = useState(0);
  const [data, setData] = useState([]);

 
  const fetchUsers = () => {
    getRequest( GET_USER_COUNT, (response) => {
      if (response && response.data) {
        setUserCount(response.data);
      }
    });
  };

  const fetchInHouseReaders = () => {
    getRequest(GET_INHOUSE_READER_COUNT, (response) => {
      if (response && response.data) {
        setReader(response.data);
      }
    });
  };


  const fetchCategories = () => {
    getRequest(GET_CATEGORY_COUNT, (response) => {
      if (response && response.data) {
        setCategoryCount(response.data);
      }
    });
  };

  const fetchBooks = () => {
    getRequest(GET_BOOK_COUNT, (response) => {
      if (response && response.data) {
        setBookCount(response.data);
      }
    });
  };


  const fetchData = () => {
    getRequest(`${GET_USER}?page=0&size=4&sortBy=id&sortDir=asc&search=`, (response) => {
      if (response && response.data) {
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
      }
    });
  };

  useEffect(() => {
    fetchBooks();
    fetchUsers();
    fetchCategories();
    fetchInHouseReaders();
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
      <TableComponent columns={columns} data={data}/>
      <Link to='/users' className="link">Browse all users</Link>
    </div>
  );
}

export default HocWrapper(Navbar, Header)(AdminDashboard);
