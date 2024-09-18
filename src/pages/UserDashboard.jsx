
import React, { useState, useEffect } from 'react';
import HocWrapper from '../components/HocWrapper';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Loader from '../components/Loader'
import TableComponent from '../components/TableComponent';
import { getRequest } from '../api/ApiManager';
import {  GET_ISSUANCE_BY_USER } from '../api/ApiConstants';
import '../styles/UserDashboard.css'


const UserDashboard = () => {

  const [data, setData] = useState([]);
  const id = localStorage.getItem('userId');


  const fetchIssuanceHistory = async () => {
    const fetchCallback = (response) => {
      if (response?.data && Array.isArray(response.data)) {
        setData(
          response.data.map((issuance, index) => ({
            sno: index + 1,
            title: issuance.books?.title || 'N/A',
            issueDate: issuance.issueDate
              ? new Date(issuance.issueDate).toLocaleDateString()
              : 'N/A',
            returnDate: issuance.returnDate
              ? new Date(issuance.returnDate).toLocaleDateString()
              : 'N/A',
            status: issuance.status || 'N/A',
            issuanceType: issuance.issuanceType || 'N/A',
          }))
        );
      } else {
        setData([]);
      }
    };
  
    await getRequest(GET_ISSUANCE_BY_USER + id, fetchCallback);
  };
  
  useEffect(() => {
    fetchIssuanceHistory();
  }, [id]);

  
  const columns = [
    { header: 'S.no.', accessor: 'sno' },
    { header: 'Title', accessor: 'title' },
    { header: 'Issue Date', accessor: 'issueDate' },
    { header: 'Return Date', accessor: 'returnDate' },
    { header: 'Status', accessor: 'status' },
    { header: 'Issuance Type', accessor: 'issuanceType' },
  ];


  return (
    <div className="user-dashboard-container">
      <h1 className="user-dashboard-heading">User History</h1>
      <div className="table-wrapper">
        <TableComponent columns={columns} data={data} />
      </div>
    </div>
  );
};


export default HocWrapper(Navbar, Header, Loader)(UserDashboard);
