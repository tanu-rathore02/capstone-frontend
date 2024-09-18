
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from './Loader';
import Header from './Header';
import Navbar from './Navbar';
import HocWrapper from './HocWrapper';
import TableComponent from './TableComponent';
import { getRequest } from '../api/ApiManager';
import { GET_ISSUANCE_BY_USER } from '../api/ApiConstants';
import '../styles/IssuanceHistory.css';

function IssuanceHistoryByUser() {
  const { userId } = useParams(); 
  const [data, setData] = useState([]);
  
 
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

  await getRequest(GET_ISSUANCE_BY_USER + userId, fetchCallback);
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
      <h2 style={{ textAlign: 'center' }}>Issuance History</h2>
      <TableComponent columns={columns} data={data} />
    </div>
  );
}

export default  HocWrapper(Navbar, Header, Loader) (IssuanceHistoryByUser);

