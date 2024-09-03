
import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "./TableComponent";
import Modal from "./Modal";
import Button from "./Button";
import InputField from "./InputField";

function UsersTable({ showPagination = true, refresh, searchTerm }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/users`, {
        headers: {
          Authorization: token
        },
        params: {
          page: currentPage,
          size: 10,
          sortBy: "id",
          sortDir: "asc",
          search: searchTerm || "",
        },
      });

      setData(response.data.content.map((user, index) => ({
        sno: index + 1 + currentPage * 10,
        name: user.name,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role,
        password: user.password,
      })));
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setMobileNumber(user.mobileNumber);
    setPassword(user.password);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/user/${selectedUser.mobileNumber}`,
        {
          name,
          mobileNumber,
          email,
          password,
          role: "ROLE_USER",
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      setIsEditModalOpen(false);
      setSelectedUser(null);
      setName('');
      setEmail('');
      setPassword('');
      setMobileNumber('');
      fetchData(); 
    } catch (error) {
      console.error('Error updating user', error);
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/user/${selectedUser.mobileNumber}`, {
        headers: { Authorization: token },
      });

      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const columns = [
    { header: "S.no.", accessor: "sno" },
    { header: "Name", accessor: "name" },
    { header: "Mobile Number", accessor: "mobileNumber" },
    { header: "Email", accessor: "email" },
    {
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <Button className='table-btn' name='Edit' onClick={() => handleEdit(row)} />
          <Button className='table-btn' name='Delete' onClick={() => handleDelete(row)} />
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
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            Next
          </button>
        </div>
      )}

      <Modal
       title="Edit User"
       isOpen={isEditModalOpen}
       onClose={() => setIsEditModalOpen(false)}
       height='300px'
       width='350px'
      >
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser();}}> 
          <InputField
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          /> 
          <InputField
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> 
          <InputField
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> 
           <InputField
            type='tel'
            placeholder='Mobile Number'
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          /> 
          <Button name="Update" className="page-btn" />
        </form>
      </Modal>
      <Modal title="Delete User"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        height='300x'
        width='350px'
      >
        <p style={{ color: 'black' }}>Are you sure you want to delete this user?</p>
        <Button name="Delete" className="page-btn" onClick={handleConfirmDelete} />
        <Button name="Cancel" className="page-btn" onClick={() => setIsDeleteModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default UsersTable;
          
