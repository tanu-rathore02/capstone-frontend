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
import {GET_DASHBOARD_COUNT ,GET_USER } from "../api/ApiConstants"; 

function AdminDashboard({showPagination = false, setLoading}) {

  const [counts, setCounts] = useState({
    userCount: 0,
    activeUserCount: 0,
    categoryCount: 0,
    bookCount: 0
  });
  const [data, setData] = useState([]);
 
  const fetchCounts = () => {
    getRequest(GET_DASHBOARD_COUNT, (response) => {
      if (response && response.data) {
        setCounts(response.data);
      }
    });
  };

  const fetchData = () => { 
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    fetchCounts();
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
      <Card name="Total Users" value={counts.userCount} image={totalUsers} />
        <Card name="In-House Readers" value={counts.activeUserCount} image={inHouseReaders} />
        <Card name="Total Categories" value={counts.categoryCount} image={totalBooks} />
        <Card name="Total Books" value={counts.bookCount} image={issuedBooks} />
      </div>
      <h2 className="heading">Registered Users</h2>
      <div  className="admin-table">
        <TableComponent columns={columns} data={data}/>
      <Link to='/users' className="link">Browse all users</Link>
      </div>
      
    </div>
  );
}

export default HocWrapper(Navbar, Header)(AdminDashboard);
