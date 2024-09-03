
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import Modal from './Modal';
import TableComponent from './TableComponent';
import InputField from './InputField';

function IssuancesTable({ showPagination = true, refresh, searchTerm}) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIssuance, setSelectedIssuance] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [issuanceType, setIssuanceType] = useState('');
  const [status, setStatus] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/issuances/allIssuances', {
        headers: { Authorization: token },
        params: {
          page: currentPage,
          size: 10,
          sortBy: 'id',
          sortDir: 'asc',
          search: searchTerm || '',
        },
      });
      setData(
        response.data.content.map((issuance, index) => ({
          id: issuance.id,
          sno: index + 1 + currentPage * 10,
          users: issuance.users?.name || 'N/A',
          books: issuance.books?.title || 'N/A',
          issueDate: issuance.issueDate,
          returnDate: issuance.returnDate,
          status: issuance.status,
          issuanceType: issuance.issuanceType,
        }))
      );
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching issuances', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, refresh, searchTerm]);

  const handleEdit = async (issuance) => {
    setSelectedIssuance(issuance);
    setUserId(issuance.userId || '');
    setBookId(issuance.bookId || '');
    setReturnDate(issuance.returnDate || '');
    setIssuanceType(issuance.issuanceType || '');
    setStatus(issuance.status || '');

    try {
      const token = localStorage.getItem('token');
      const [bookResponse, userResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/books/allForDropDown', {
          headers: { Authorization: token },
        }),
        axios.get('http://localhost:8080/api/allUsersForDropDown', {
          headers: { Authorization: token },
        }),
      ]);
      setBooks(bookResponse.data);
      setUsers(userResponse.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching users or books', error);
    }
  };

  const handleUpdateIssuance = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        bookId: bookId,
        userId: userId,
        returnDate: returnDate,
        status: status.toUpperCase(),
        issuanceType: issuanceType.replace(/\s+/g, '-').toUpperCase(),
      };

      await axios.put(
        `http://localhost:8080/api/issuances/updateIssuance/${selectedIssuance.id}`,
        updateData,
        { headers: { Authorization: token } }
      );

      setIsEditModalOpen(false);
      setSelectedIssuance(null);
      setUserId('');
      setBookId('');
      setStatus('');
      setIssuanceType('');
      setReturnDate('');
      fetchData();
    } catch (error) {
      console.error('Error updating issuances', error);
    }
  };

  const handleDelete = (issuance) => {
    setSelectedIssuance(issuance);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/issuances/deleteIssuance/${selectedIssuance.id}`, {
        headers: { Authorization: token },
      });

      setIsDeleteModalOpen(false);
      setSelectedIssuance(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting issuance', error);
    }
  };

  const columns = [
    { header: 'S. no.', accessor: 'sno' },
    { header: 'Users', accessor: 'users' },
    { header: 'Books', accessor: 'books' },
    { header: 'Issued At', accessor: 'issueDate' },
    { header: 'Returned At', accessor: 'returnDate' },
    { header: 'Status', accessor: 'status' },
    { header: 'Issuance Type', accessor: 'issuanceType' },
    {
      header: 'Action',
      Cell: ({ row }) => (
        <div>
          <Button className="table-btn" name="Edit" onClick={() => handleEdit(row)} />
          <Button className="table-btn" name="Delete" onClick={() => handleDelete(row)} />
        </div>
      ),
    },
  ];

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="table-container">
       <TableComponent columns={columns} data={data} />
       {showPagination && (
        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={currentPage === 0}>
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
      <Modal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      title="Edit Issuance"
      height="350px"
      width="400px"
      >
        <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateIssuance();
        }}
        >
         <select 
         value={userId} 
         onChange={(e) => setUserId(e.target.value)}>
          <option value=""> Select User</option>
          {users.map((user) => (
            <option key= {user.id} value={user.id}>
              {user.name}
            </option>
          ))}
         </select>
         <select 
         value={bookId} 
         onChange={(e) => setBookId(e.target.value)}>
          <option value=""> Select Book</option>
          {books.map((book) => (
            <option key= {book.id} value={book.id}>
              {book.title}
            </option>
          ))}
         </select>
         <InputField
            type="date"
            placeholder="returned at"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
         <div>
            <label>Status:</label>
            <input
              type="radio"
              value="ISSUED"
              checked={status === 'ISSUED'}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
            <label>ISSUED</label>
            <input
              type="radio"
              value="RETURNED"
              checked={status === 'RETURNED'}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
            <label>RETURNED</label>
          </div>
          <div>
            <label>Issuance Type:</label>
            <input
              type="radio"
              value="IN-HOUSE"
              checked={issuanceType === 'IN-HOUSE'}
              onChange={(e) => setIssuanceType(e.target.value)}
              required
            />
            <label>In House</label>
            </div>
<Button name="Update" className="page-btn" />
<Button
          name="Cancel"
          className="page-btn"
          onClick={() => setIsEditModalOpen(false)}
        />
 </form>
 </Modal>
 <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Book"
        height="250px"
        width="350px"
      >
        <p style={{ color: "black" }}>
          Are you sure you want to delete this book?
        </p>
        <Button
          name="Delete"
          className="page-btn"
          onClick={handleConfirmDelete}
        />
        <Button
          name="Cancel"
          className="page-btn"
          onClick={() => setIsDeleteModalOpen(false)}
        />
      </Modal>

    </div>
  )
}

export default IssuancesTable