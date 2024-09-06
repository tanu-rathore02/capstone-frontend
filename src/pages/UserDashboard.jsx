
import React, { useState, useEffect } from 'react';
import HocWrapper from '../components/HocWrapper';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import TableComponent from '../components/TableComponent';
import axios from 'axios';


const UserDashboard = () => {

  const [data, setData] = useState([]);
  const id = localStorage.getItem('userId');


  const fetchUserHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('userId');  
      if (!id) {
        console.error("User ID is missing");
        return;
      }
  
      const response = await axios.get(`http://localhost:8080/api/issuances/user/${id}`, {
        headers: { Authorization: token },
      });
  
      console.log('Issuance Data:', response.data);
  
      if (response.data && Array.isArray(response.data)) {
        setData(response.data.map((issuance, index) => ({
          sno: index + 1,
          title: issuance.books?.title || 'N/A',
          issueDate: issuance.issueDate ? new Date(issuance.issueDate).toLocaleDateString() : 'N/A',
          returnDate: issuance.returnDate ? new Date(issuance.returnDate).toLocaleDateString() : 'N/A',
          status: issuance.status || 'N/A',
          issuanceType: issuance.issuanceType || 'N/A',
        })));
      } else {
        console.error('Unexpected response format:', response);
        setData([]); 
      }
    } catch (error) {
      console.error('Error fetching issuance history', error);
      setData([]);
    }
  };
  

  useEffect(() => {
    fetchUserHistory();
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


export default HocWrapper(Navbar, Header)(UserDashboard);
