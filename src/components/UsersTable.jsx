import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableComponent from "./TableComponent";
import Modal from "./Modal";
import Button from "./Button";


function UsersTable({ showPagination = true, refresh, searchTerm }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [books, setBooks] = useState([]); //dropdown
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

  //Get API
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/users`, {
        headers: {
          Authorization: token,
        },
        params: {
          page: currentPage,
          size: 8,
          sortBy: "id",
          sortDir: "asc",
          search: searchTerm || "",
        },
      });

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
      console.log("data:", data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, refresh]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/books/allForDropDown",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    fetchBooks();
  }, [isAssignModalOpen]);

  //Assignment functions
  const handleAssign = (user) => {
    setUsername(user.name);
    setUserId(user.id);
    setIsAssignModalOpen(true);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    const formattedStatus = status.toUpperCase();
    const formattedIssuanceType = issuanceType
      .replace(/\s+/g, "-")
      .toUpperCase();

    const formattedReturnDate = returnDate ? `${returnDate}T00:00:00` : "";

    console.log({
      userId: data?.id,
      bookId: bookname,
      status: formattedStatus,
      issuanceType: formattedIssuanceType,
      returnDate: formattedReturnDate,
    });

    try {
      const token = localStorage.getItem("token");
      const issuanceData = {
        userId: userId,
        bookId: bookname,
        status: formattedStatus,
        issuanceType: formattedIssuanceType,
        returnDate: formattedReturnDate,
      };
      const response = await axios.post(
        "http://localhost:8080/api/issuances/createIssuance",
        issuanceData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Issuance created:", response.data);
      setIsAssignModalOpen(false);
      setStatus("");
      setReturnDate("");
      setIssuanceType("");
      setBookname("");
      setUsername("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating issuance", error);
      setErrorMessage("Failed to add issuance. Please try again");
    }
  };

  //Update Functions
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
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/user/updateUser/${selectedUser.mobileNumber}`,
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
            "Content-Type": "application/json",
          },
        }
      );

      setIsEditModalOpen(false);
      setSelectedUser(null);
      setName("");
      setEmail("");
      setPassword("");
      setMobileNumber("");
      fetchData();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  //Delete Functions
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/user/deleteUser/${selectedUser.mobileNumber}`,
        {
          headers: { Authorization: token },
        }
      );

      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting user", error);
    }
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

      {/* Edit Modal */}
      <Modal
        title="Edit User"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        height="500px"
        width="450px"
      >
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
