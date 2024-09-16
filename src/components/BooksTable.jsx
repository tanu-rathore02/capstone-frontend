import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Modal from "./Modal";
import TableComponent from "./TableComponent";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import assignIcon from "../assets/assignIcon.svg";
import historyIcon from "../assets/historyIcon.svg";

import Dropdown from "../components/Dropdown"
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

function BooksTable({
  showPagination = true,
  refresh,
  searchTerm,
  setLoading,
}) {
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
  const [issueDate, setIssueDate] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [id, setId] = useState();
  const [title, setTitle] = useState();
  const [author, setAuthor] = useState("");
  const [availability, setAvailability] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState();
  const [isError, setIsError] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);


  const navigate = useNavigate();

  const fetchData = () => {
    setLoading(true);
    getRequest(
      `${GET_BOOK}?page=${currentPage}&size=7&sortBy=id&sortDir=desc&search=${
        searchTerm || ""
      }`,
      (response) => {
        if (response?.status === 200 || response.status === 201) {
          setData(
            response.data.content.map((book, index) => ({
              id: book.id,
              sno: index + 1 + currentPage * 7,
              title: book.title,
              author: book.author,
              availability: book.availability,
              category: book.categories?.categoryName || "N/A",
            }))
          );
          setTotalPages(response.data.totalPages);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    );
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, refresh]);

  useEffect(() => {
    const fetchUsers = () => {
      getRequest(GET_ALL_USER, (response) => {
        if (response?.status === 200 || response.status === 201) {
          const options = response.data.map(user => ({
            value: user.id,
            label: `${user.mobileNumber} - ${user.name}`
          }));
          setUsers(response.data);
          setUserOptions(options);
        }
      });
    };

    fetchUsers();
  }, [isAssignModalOpen]);

  useEffect(() => {
    const fetchCategories = () => {
      getRequest(GET_ALL_CATEGORY, (response) => {
        if (response?.status === 200) {
          const options = response.data.map(cat => ({
            value: cat.id,
            label: cat.categoryName
          }));
          setCategories(response.data);
          setCategoryOptions(options);
        }
      });
    };

    fetchCategories();
  }, [isEditModalOpen]);

  
  const handleCategorySelect = (selectedOption) => {
    setCategoryId(selectedOption.value);
  };

  const handleUserSelect = (selectedOption) => {
    setMobileNumber(selectedOption.value);
  };


  // Validation Functions
  const validateEditForm = () => {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedTitle || !trimmedAuthor || !availability || !categoryId) {
      setMessage("Please fill all the fields!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }
    if (
      specialCharacterRegex.test(title) ||
      specialCharacterRegex.test(author)
    ) {
      setMessage("Title and Author cannot contain special characters!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }
    const availabilityNumber = parseFloat(availability);

    if (isNaN(availabilityNumber)) {
      setMessage("Availability must be a valid number!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }

    if (availabilityNumber < 0) {
      setMessage("Availability cannot be a negative number!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }

    if (availabilityNumber % 1 !== 0) {
      setMessage("Availability cannot be a decimal value!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }

    return true;
  };
  const validateAssignmentForm = () => {
    const issueDateObj = new Date(issueDate);
    const returnDateObj = new Date(returnDate);

    if (!returnDate || !issuanceType || !mobileNumber) {
      setMessage("Please fill out all the fields!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }

    if (returnDateObj < issueDateObj) {
      setMessage("Return date cannot be earlier than Issue Date!");
      setIsError(true);
      setIsMessage(true);
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
    setIsMessage(false);
    const now = new Date();
    const formattedIssueDate = now.toISOString().slice(0, 16);
    setIssueDate(formattedIssueDate);
  };
  
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    if (!validateAssignmentForm()) {
      return;
    }

    const formattedReturnDate = returnDate
      ? new Date(returnDate).toISOString()
      : "";

    const formattedIssuanceType = issuanceType
      .replace(/\s+/g, "-")
      .toUpperCase();

    const issuanceData = {
      userId: mobileNumber,
      bookId: id,
      status: 'ISSUED',
      issuanceType: formattedIssuanceType,
      returnDate: formattedReturnDate,
    };

    postRequest(CREATE_ISSUANCE, issuanceData, (response) => {
      if (response?.status === 200 || response?.status === 201) {
  
        setMessage(response?.data.statusMsg);
        setIsError(false);
        setIsMessage(true);
        setStatus("");
        setIssuanceType("");
        setReturnDate("");
        setUsername("");
        setMobileNumber("");
        setTimeout(() => {
          setIsAssignModalOpen(false);
          navigate("/issuances");
        }, 2000);
      } else if (response?.status === 400 || response?.status === 409) {
        setMessage(response?.data.statusMsg);
        setIsError(true);
        setIsMessage(true);
      } else {
        setMessage(response?.data.statusMsg);
        setIsError(true);
        setIsMessage(true);
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
    setIsMessage(false);
  };

  const handleUpdateBook = async () => {
    if (!validateEditForm()) {
      return;
    }

    const trimmedTitle = title.trim();

    const updateData = {
      title: trimmedTitle,
      author: author,
      categoryId: categoryId,
      availability: availability,
    };

    putRequest(`${UPDATE_BOOK}${selectedBook.id}`, updateData, (response) => {
      if (response?.status === 200 || response?.status === 201) {
        setMessage(response?.data.statusMsg);
        setIsError(false);
        setIsMessage(true);
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
        setMessage(response?.data.statusMsg);
        setIsError(true);
        setIsMessage(true);
      } else {
        setMessage(response?.data.statusMsg);
        setIsError(true);
        setIsMessage(true);
      }
    });
  };

  //Delete Function
  const handleDelete = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
    setMessage("");
    setIsMessage(false);
  };

  const handleConfirmDelete = async () => {
    deleteRequest(`${DELETE_BOOK}${selectedBook.id}`, (response) => {
      if (response?.status === 200 || response?.status === 201) {
        setMessage(response?.data.statusMsg);
        setIsError(false);
        setIsMessage(true);

        setTimeout(() => {
          setIsDeleteModalOpen(false);
          setSelectedBook(null);
        }, 2000);
        fetchData();
      } else if (response?.status === 405) {
        setMessage(response?.data.statusMsg);
        setIsError(true);
        setIsMessage(true);
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
        <div className="table-component-actions">
          <Button
            className="table-btn"
            imageSrc={editIcon}
            active={true}
            onClick={() => handleEdit(row)}
            tooltip="edit"
          />
          <Button
            className="table-btn"
            imageSrc={deleteIcon}
            active={true}
            onClick={() => handleDelete(row)}
            tooltip="delete"
          />
          <Button
            className="table-btn"
            imageSrc={historyIcon}
            active={true}
            onClick={() => handleHistory(row)}
            tooltip="view history"
          />
          <Button
            className="table-btn"
            imageSrc={assignIcon}
            active={true}
            onClick={() => handleAssign(row)}
            disabled={row.availability === 0}
            tooltip={row.availability === 0 ? "Book is not available at this moment" : "Assign book"}
          />
        </div>
      ),
    },
  ];

  const modalDimension = isMessage
    ? { height: "600", width: "400px" }
    : { height: "550", width: "400px" };
  const deleteModalDimension = isMessage
    ? { height: "280px", width: "300px" }
    : { height: "220px", width: "300px" };
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
        height={modalDimension.height}
        width={modalDimension.width}
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
          <Dropdown
            options={categoryOptions}
            onSelect={handleCategorySelect}
            placeholder="Select Category"
            initialValue={categoryOptions.find(opt => opt.value === categoryId)}
          />
          <label htmlFor="availability">Availability</label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <div className="modal-button-group">
            <Button name="Update" className="modal-btn" />
            <Button
              name="Cancel"
              className="modal-btn"
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
        height={deleteModalDimension.height}
        width={deleteModalDimension.width}
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
            className="modal-btn"
            onClick={handleConfirmDelete}
          />
          <Button
            name="Cancel"
            className="modal-btn"
            onClick={() => setIsDeleteModalOpen(false)}
          />
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal
        title="Assign Book"
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        height={modalDimension.height}
        width={modalDimension.width}
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
          <label htmlFor="mobileNumber">User:</label>
          <Dropdown
            options={userOptions}
            onSelect={handleUserSelect}
            placeholder="Select User"
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
          {issuanceType === "IN-HOUSE" ? (
            <input
              label="Return Time"
              type="time"
              value={returnDate ? returnDate.split("T")[1] : ""} 
              onChange={(e) => {
                const datePart =
                  returnDate.split("T")[0] ||
                  new Date().toISOString().split("T")[0];
                setReturnDate(`${datePart}T${e.target.value}`);
              }}
            />
          ) : (
            <input
              label="Return Date & Time"
              type="datetime-local"
              value={returnDate || ""} 
              onChange={(e) => setReturnDate(e.target.value)}
              min={issueDate}
            />
          )}

          <div className="modal-button-group">
            <Button className="modal-btn" type="submit" name="Assign" />
            <Button
              name="Cancel"
              className="modal-btn"
              onClick={() => setIsAssignModalOpen(false)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default BooksTable;
