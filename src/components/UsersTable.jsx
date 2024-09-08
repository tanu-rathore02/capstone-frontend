import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableComponent from "./TableComponent";
import Modal from "./Modal";
import Button from "./Button";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../api/ApiManager";
import {
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
  GET_ALL_BOOK,
  CREATE_ISSUANCE,
} from "../api/ApiConstants";

function UsersTable({ showPagination = true, refresh, searchTerm }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [bookname, setBookname] = useState("");
  const [status, setStatus] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [isError, setIsError] = useState(false);

  //Get API
  const fetchData = () => {
    getRequest(
      `${GET_USER}?page=${currentPage}&size=8&sortBy=id&sortDir=desc&search=${
        searchTerm || ""
      }`,
      (response) => {
        if (response?.status === 200 || 201) {
          setData(
            response.data.content.map((user, index) => ({
              sno: index + 1 + currentPage * 8,
              id: user.id,
              name: user.name,
              mobileNumber: user.mobileNumber,
              email: user.email,
              role: user.role,
              password: user.password,
            }))
          );
          setTotalPages(response.data.totalPages);
        } else {
          console.error("Error fetching the books", response?.error);
        }
      }
    );
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, refresh]);

  useEffect(() => {
    const fetchBooks = () => {
      getRequest(`${GET_ALL_BOOK}`, (response) => {
        if (response?.status === 200 || 201) {
          setBooks(response.data);
        } else {
          console.error("Error fetching books", response?.error);
        }
      });
    };
    fetchBooks();
  }, [isAssignModalOpen]);

  const validateEditForm = () => {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!name || !mobileNumber || !email) {
      setMessage("Please fill all the fields!");
      setIsError(true);
      return false;
    }
    if (specialCharacterRegex.test(name) || specialCharacterRegex.test(mobileNumber)) {
      setMessage("Username cannot contain special characters!");
      setIsError(true);
      return false;
    }
   
    if (!email) {
      setMessage("Email is required.");
      setIsError(true);
      return false;
    } else {
      let atIndex = email.indexOf('@');
      let dotIndex = email.indexOf('.');
  
      if (atIndex === -1 || dotIndex === -1 || email.slice(dotIndex) !== ".com" || dotIndex < atIndex) {
        setMessage("Invalid email format. Domain must end with .com");
        setIsError(true);
        return false;
      }
    }

    if (!/^\d+$/.test(mobileNumber)) {
      setMessage("Phone number must contain only digits.");
      return false;
    }else if (mobileNumber.length <10){
      setMessage("Phone number must be 10 digits long");
      return false;
    }
    return true;
  };


  const validateAssignmentForm = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (!returnDate || !status || !issuanceType) {
      setMessage("Please fill all the fields!");
      setIsError(true);
      return false;
    }

    if (returnDate < today) {
      setMessage("Return date cannot be earlier than today!");
      setIsError(true);
      return false;
    }

    return true;
  };

  //Assignment functions
  const handleAssign = (user) => {
    setUsername(user.name);
    setUserId(user.id);
    setIsAssignModalOpen(true);
    setMessage("");
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();

    if (!validateAssignmentForm()) {
      return;
    }

    const formattedStatus = status.toUpperCase();
    const formattedIssuanceType = issuanceType
      .replace(/\s+/g, "-")
      .toUpperCase();

    const formattedReturnDate = returnDate ? `${returnDate}T00:00:00` : "";

    const issuanceData = {
      userId: userId,
      bookId: bookname,
      status: formattedStatus,
      issuanceType: formattedIssuanceType,
      returnDate: formattedReturnDate,
    };

    postRequest(CREATE_ISSUANCE, issuanceData, (response) => {
      if (response?.status === 200 || response?.status === 201) {
        console.log("Issuance created:", response.data);
        setMessage("Issuance added successfully!");
        setIsError(false);
        setStatus("");
        setReturnDate("");
        setIssuanceType("");
        setBookname("");
        setUsername("");
        setErrorMessage("");
        setTimeout(() => {
          setIsAssignModalOpen(false);
          navigate("/issuances");
        }, 2000);
      } else if (response?.status === 400 || response?.status === 409) {
        console.error("Issuance creation failed:", response?.data);
        setMessage("Failed to add issuance. Please try again");
        setIsError(true);
      } else {
        console.error("Unexpected error:", response?.data);
        setMessage("An unexpected error occurred. Please try again");
        setIsError(true);
      }
    });
  };

  //Update Functions
  const handleEdit = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setMobileNumber(user.mobileNumber);
    setPassword(user.password);
    setIsEditModalOpen(true);
    setMessage("");
  };

  const handleUpdateUser = () => {

    if(!validateEditForm){
      return;
    }
    const updateData = {
      name,
      mobileNumber,
      email,
      password,
      role: "ROLE_USER",
    };

    putRequest(
      `${UPDATE_USER}/${selectedUser.mobileNumber}`,
      updateData,
      (response) => {
        if (response?.status === 200) {
          console.log("Book updated successfully", updateData);
          setMessage("Book updated successfully!");
          setIsError(false);
          setTimeout(() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
            setName("");
            setEmail("");
            setMobileNumber("");
          }, 2000);
          fetchData();
        } else if (response?.status === 409) {
          setMessage("A user with these credentials already exists!");
          setIsError(true);
        } else {
          setMessage("Error updating user details!");
          setIsError(true);
          console.error("Error updating user details", response?.data);
        }
      }
    );
  };

  //Delete Functions
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
    setMessage("");
  };
  const handleConfirmDelete = () => {
    deleteRequest(`${DELETE_USER}/${selectedUser.mobileNumber}`, (response) => {
      if (response?.status === 200) {
        setMessage("User deleted successfully!");
        setIsError(false);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        fetchData();
      } else {
        setMessage("Error deleting Book! Book from this category is issued");
        setIsError(true);
        console.error("Error deleting category", response?.data);
      }
    });
  };

  //Other Functions
  const handleHistory = (user) => {
    navigate(`/user/${user.id}/issuanceHistory?type=user`);
  };

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

  const columns = [
    { header: "S.no.", accessor: "sno" },
    { header: "Name", accessor: "name" },
    { header: "Mobile Number", accessor: "mobileNumber" },
    { header: "Email", accessor: "email" },
    {
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <Button
            className="table-btn"
            name="Edit"
            onClick={() => handleEdit(row)}
          />
          <Button
            className="table-btn"
            name="Delete"
            onClick={() => handleDelete(row)}
          />
          <Button
            className="table-btn"
            name="History"
            onClick={() => handleHistory(row)}
          />
          <Button
            className="table-btn"
            name="Assign"
            onClick={() => handleAssign(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="table-container">
      {data.length > 0 ? (
        <>
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
        </>
      ) : (
        <p className="no-data-message">No data available</p>
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit User"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        height="500px"
        width="450px"
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <form onSubmit={handleUpdateUser}>
          <label htmlFor="name">Username</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="modal-button-group">
            <Button className="table-btn" type="submit" name="Save" />
            <Button
              name="Cancel"
              className="table-btn"
              onClick={() => setIsEditModalOpen(false)}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete User"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        height="250px"
        width="300px"
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <p>Are you sure you want to delete this user?</p>
        <div className="modal-button-group">
          <Button
            className="table-btn"
            name="Delete"
            onClick={handleConfirmDelete}
          />
          <Button
            className="table-btn"
            name="Cancel"
            onClick={() => setIsDeleteModalOpen(false)}
          />
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal
        title="Assign Book"
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        height="580px"
        width="500px"
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <form onSubmit={handleAssignmentSubmit}>
          <label htmlFor="name">Username</label>
          <input type="text" value={username} readOnly />

          <label htmlFor="bookname">Book:</label>
          <select
            value={bookname}
            onChange={(e) => setBookname(e.target.value)}
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>

          <label htmlFor="status">Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="ISSUED">Issued</option>
            <option value="RETURNED">Returned</option>
          </select>

          <label htmlFor="issuanceType">Issuance Type:</label>
          <select
            value={issuanceType}
            onChange={(e) => setIssuanceType(e.target.value)}
          >
            <option value="">Select Issuance Type</option>
            <option value="IN-HOUSE">IN-HOUSE</option>
            <option value="TAKE-AWAY">TAKE-AWAY</option>
          </select>
          <label htmlFor="returndate">Returned At</label>
          <input
            label="Return Date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
          {errorMessage && <p>{errorMessage}</p>}
          <div className="modal-button-group">
            <Button className="table-btn" type="submit" name="Assign" />
            <Button
              name="Cancel"
              className="table-btn"
              onClick={() => setIsAssignModalOpen(false)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UsersTable;
