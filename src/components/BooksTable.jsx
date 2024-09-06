import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "./Button";
import Modal from "./Modal";
import TableComponent from "./TableComponent";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import assignIcon from "../assets/assignIcon.svg";
import historyIcon from "../assets/historyIcon.svg"

function BooksTable({ showPagination = true, refresh, searchTerm }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [username, setUsername] = useState("");
  const [id, setId] = useState();
  const [title, setTitle] = useState();
  const [author, setAuthor] = useState("");
  const [availability, setAvailability] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/books/allBooks`,
        {
          headers: { Authorization: token },
          params: {
            page: currentPage,
            size: 8,
            sortBy: "id",
            sortDir: "asc",
            search: searchTerm || "",
          },
        }
      );

      setData(
        response.data.content.map((book, index) => ({
          id: book.id,
          sno: index + 1 + currentPage * 8,
          title: book.title,
          author: book.author,
          availability: book.availability,
          category: book.categories?.categoryName || "N/A",
        }))
      );
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, refresh]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/allUsersForDropDown",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    fetchUsers();
  }, [isAssignModalOpen]);

  //Assignment Functions
  const handleAssign = (book) => {
    setId(book.id);
    setTitle(book.title);
    setIsAssignModalOpen(true);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    const formattedStatus = status.toUpperCase();
    const formattedIssuanceType = issuanceType
      .replace(/\s+/g, "-")
      .toUpperCase();
    const formattedReturnDate = returnDate ? `${returnDate}T00:00:00` : "";

    const issuanceData = {
      userId: username,
      bookId: id,
      status: formattedStatus,
      issuanceType: formattedIssuanceType,
      returnDate: formattedReturnDate,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/issuances/createIssuance",
        issuanceData,
        {
          headers: { Authorization: token },
        }
      );

      console.log("Issuance created:", response.data);
      setIsAssignModalOpen(false);
      // Reset form fields
      setStatus("");
      setIssuanceType("");
      setReturnDate("");
      setUsername("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating issuance", error);
      setErrorMessage("Failed to create issuance. Please try again.");
    }
  };

  //Update Functions
  const handleEdit = async (book) => {
    setSelectedBook(book);
    setTitle(book.id);
    setAuthor(book.author);
    setAvailability(book.availability);
    setCategoryId(book.categoryId || "");

    try {
      const token = localStorage.getItem("token");
      const categoryResponse = await axios.get(
        "http://localhost:8080/api/categories/allForDropDown",
        { headers: { Authorization: token } }
      );
      // const response = await apiManager.getAllCategoriesDD();
      setCategories(categoryResponse.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleUpdateBook = async () => {
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        title: title,
        author: author,
        categoryId: categoryId,
        availability: availability,
      };

      await axios.put(
        `http://localhost:8080/api/books/updateBook/${selectedBook.id}`,
        updateData,
        { headers: { Authorization: token } }
      );
      // await apiManager.updateBook(selectedBook.id, updateData);

      setIsEditModalOpen(false);
      setSelectedBook(null);
      setTitle("");
      setAuthor("");
      setAvailability("");
      setCategoryId("");
      fetchData();
    } catch (error) {
      console.error("Error updating book", error);
    }
  };

  //Delete Functions
  const handleDelete = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/books/deleteBook/${selectedBook.id}`,
        { headers: { Authorization: token } }
      );
      // try {
      //   await apiManager.deleteBook(selectedBook.id);

      setIsDeleteModalOpen(false);
      setSelectedBook(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting book", error);
    }
  };
  //Other Functions
  const handleHistory = (book) => {
    navigate(`/book/${book.id}/issuanceHistory?type=book`);
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
    { header: "S.no", accessor: "sno" },
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author" },
    { header: "Category", accessor: "category" },
    { header: "Availability", accessor: "availability" },
    {
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <Button
            className= "table-btn"
            
            imageSrc={editIcon}
            active={true}
            onClick={() => handleEdit(row)}
          />
          <Button
            className="table-btn"
            imageSrc={deleteIcon}
            active={true}
            onClick={() => handleDelete(row)}
          />
          <Button
            className="table-btn"
           imageSrc={historyIcon}
           active={true}
            onClick={() => handleHistory(row)}
          />
          <Button
            className="table-btn"
            imageSrc={assignIcon}
            active={true}
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
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Book"
        height="500px"
        width="450px"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateBook();
          }}
        >
          <label htmlFor="title">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="Author">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <label htmlFor="category">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          <label htmlFor="availability">Availability</label>
          <input
            type="number"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <div className="modal-button-group">
            <Button name="Update" className="table-btn" />
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
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Book"
        height="250px"
        width="350px"
      >
        <p style={{ color: "black" }}>
          Are you sure you want to delete this book?
        </p>
        <div className="modal-button-group">
          <Button
            name="Delete"
            className="table-btn"
            onClick={handleConfirmDelete}
          />
          <Button
            name="Cancel"
            className="table-btn"
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
        width="450px"
      >
        <form onSubmit={handleAssignmentSubmit}>
        <label htmlFor="username">Username</label>
          <input
            
            type="text"
            value={title}
            readOnly
            style={{ color: "black" }}
          />
         
            <label htmlFor="username">User:</label>
            <select
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
        
       
            <label htmlFor="status">Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="ISSUED">ISSUED</option>
              <option value="RETURNED">RETURNED</option>
            </select>
         
          
            <label htmlFor="issuanceType">Issuance Type:</label>
            <select
              value={issuanceType}
              onChange={(e) => setIssuanceType(e.target.value)}
            >
              <option value="">Select Issuance Type</option>
              <option value="IN-HOUSE">IN-HOUSE</option>
              <option value="TAKE AWAY">TAKE-AWAY</option>
            </select>
            <label htmlFor="returnDate">Returned At</label>
          <input
           
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

export default BooksTable;
