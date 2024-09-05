
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TableComponent from './TableComponent';

function IssuanceHistoryByUser() {
  const { userId } = useParams(); 
  const [data, setData] = useState([]);
  
  const fetchIssuanceHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/issuances/user/${userId}`, {
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
    fetchIssuanceHistory();
  }, [userId]);

  const columns = [
    { header: 'S.no.', accessor: 'sno' },
    { header: 'Title', accessor: 'title' },
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

