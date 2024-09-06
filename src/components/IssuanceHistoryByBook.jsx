import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TableComponent from './TableComponent';
import '../styles/Pages.css'

function IssuanceHistoryByUser() {
  const { bookId } = useParams(); 
  const [data, setData] = useState([]);

  const fetchIssuanceHistory = async () => {
  
      const token = localStorage.getItem('token');
      console.log('Book ID:', bookId); 

      const response = await axios.get(`http://localhost:8080/api/issuances/book/${bookId}`, {
        headers: { Authorization: token },
      });

      console.log('API Response:', response); 

      if (response.data && Array.isArray(response.data)) {
        setData(response.data.map((issuance, index) => ({
          sno: index + 1,
          username: issuance.users?.name || 'N/A',
          issueDate: issuance.issueDate ? new Date(issuance.issueDate).toLocaleDateString() : 'N/A',
          returnDate: issuance.returnDate ? new Date(issuance.returnDate).toLocaleDateString() : 'N/A',
          status: issuance.status || 'N/A',
          issuanceType: issuance.issuanceType || 'N/A',
        })));
      } else {
        console.error('Unexpected response format:', response);
        setData([]);
      }
   
     
   
  };

  useEffect(() => {
    fetchIssuanceHistory();
  console.log("bookId", bookId);
  }, [bookId]);

  const columns = [
    { header: 'S.no.', accessor: 'sno' },
    { header: 'Username', accessor: 'username' },
    { header: 'Issue Date', accessor: 'issueDate' },
    { header: 'Return Date', accessor: 'returnDate' },
    { header: 'Status', accessor: 'status' },
    { header: 'Issuance Type', accessor: 'issuanceType' },
  ];

  return (
    <div className="issuance-history-container">
      <h2>Issuance History</h2>
      <TableComponent columns={columns} data={data} />
    </div>
  );
}

export default IssuanceHistoryByUser;
