import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Modal from "./Modal";
import TableComponent from "./TableComponent";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import assignIcon from "../assets/assignIcon.svg";
import historyIcon from "../assets/historyIcon.svg";
import {
  GET_BOOK,
  UPDATE_BOOK,
  DELETE_BOOK,
  GET_ALL_CATEGORY,
  GET_ALL_USER,
  CREATE_ISSUANCE,
} from "../api/ApiConstants";
import {
  getRequest,
  putRequest,
  deleteRequest,
  postRequest,
} from "../api/ApiManager";

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
  const [message, setMessage] = useState();
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const fetchData = () => {
    getRequest(
      `${GET_BOOK}?page=${currentPage}&size=8&sortBy=id&sortDir=desc&search=${searchTerm || ""}`,
      (response) => {
        if (response?.status === 200 || 201) {
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
        } else {
          console.error("Error fetching the books", response?.error);
        }
      }
    );
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, refresh]);

  const fetchUsers = () => {
    getRequest(`${GET_ALL_USER}`, (response) => {
      if (response?.status === 200 || 201) {
        setUsers(response.data);
      } else {
        console.error("Error fetching users", response?.error);
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [isAssignModalOpen]);

  useEffect(() => {
    const fetchCategories = () => {
      getRequest(GET_ALL_CATEGORY, (response) => {
        if (response?.status === 200) {
          setCategories(response.data);
        } else {
          console.error("Error fetching categories", response?.data);
        }
      });
    };

    fetchCategories();
  }, [isEditModalOpen]);

  // Validation Functions
  const validateEditForm = () => {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!title || !author || !availability || !categoryId) {
      setMessage("Please fill all the fields!");
      setIsError(true);
      return false;
    }
    if (specialCharacterRegex.test(title) || specialCharacterRegex.test(author)) {
      setMessage("Title and Author cannot contain special characters!");
      setIsError(true);
      return false;
    }
    if (availability < 0) {
      setMessage("Availability cannot be a negative number!");
      setIsError(true);
      return false;
    }
    return true;
  };

  const validateAssignmentForm = () => {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!username || !status || !issuanceType) {
      setMessage("Please fill all the fields!");
      setIsError(true);
      return false;
    }
    if (specialCharacterRegex.test(username)) {
      setMessage("Username cannot contain special characters!");
      setIsError(true);
      return false;
    }
    return true;
  };

  //Assignment Functions
  const handleAssign = (book) => {
    setId(book.id);
    setTitle(book.title);
    setIsAssignModalOpen(true);
    setMessage("");
  };

  const handleAssignmentSubmit = async (e) => {
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
      userId: username,
      bookId: id,
      status: formattedStatus,
      issuanceType: formattedIssuanceType,
      returnDate: formattedReturnDate,
    };

    postRequest(CREATE_ISSUANCE, issuanceData, (response) => {
      if (response?.status === 200 || 201) {
        setMessage("Issuance added successfully!");
        setIsError(false);
        setStatus("");
        setIssuanceType("");
        setReturnDate("");
        setUsername("");
        setTimeout(() => {
          setIsAssignModalOpen(false);
          navigate('/issuances')
        }, 2000);
      } else {
        setMessage("Failed to add Issuance. Please try again");
        setIsError(true);
        console.error("Error creating category", response?.data);
      }
    });
  };

  //Update Functions
  const handleEdit = async (book) => {
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setAvailability(book.availability);
    setCategoryId(book.categories || "");
    setIsEditModalOpen(true);
    setMessage("");
  };

  const handleUpdateBook = async () => {
    if (!validateEditForm()) {
      return;
    }

    const updateData = {
      title: title,
      author: author,
      categoryId: categoryId,
      availability: availability,
    };

    putRequest(`${UPDATE_BOOK}${selectedBook.id}`, updateData, (response) => {
      if (response?.status === 200 || response?.status === 201) {
        console.log("Book updated successfully", updateData);
        setMessage("Book updated successfully!");
        setIsError(false);
        setTimeout(() => {
          setIsEditModalOpen(false);
          setSelectedBook(null);
          setTitle("");
          setAuthor("");
          setAvailability("");
          setCategoryId("");
        }, 2000);
        fetchData();
      } else if (response?.status === 409) {
        setMessage("A book with this title already exists!");
        setIsError(true);
      } else {
        setMessage("Error updating book!");
        setIsError(true);
        console.error("Error updating book", response?.data);
      }
    });
  };

  //Delete Function
  const handleDelete = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
    setMessage("");
  };

  const handleConfirmDelete = async () => {
    deleteRequest(`${DELETE_BOOK}title/${selectedBook.title}`, (response) => {
      if (response?.status === 200) {
        setMessage("Book deleted successfully!");
        setIsError(false);
        setTimeout(() => {
          setIsDeleteModalOpen(false);
          setSelectedBook(null);
        }, 2000);
        fetchData();
      } else {
        setMessage("Error deleting Book! Book from this category is issued");
        setIsError(true);
        console.error("Error deleting category", response?.data);
      }
    });
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
            className="table-btn"
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
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Book"
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
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
         {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
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
         {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <form onSubmit={handleAssignmentSubmit}>
          <label htmlFor="username">Title</label>
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

          <label htmlFor="status">Status</label>
          <input
            type="text"
            value="ISSUED"
            readOnly
            style={{ color: "black" }}
          />

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
          {/* {errorMessage && <p>{errorMessage}</p>} */}
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

