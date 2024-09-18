import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import TableComponent from "./TableComponent";
import Modal from "./Modal";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import assignIcon from "../assets/assignIcon.svg";
import historyIcon from "../assets/historyIcon.svg";
import Button from "./Button";
import {
  getRequest,
  postRequest,
  deleteRequest,
  patchRequest,
} from "../api/ApiManager";
import {
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
  GET_ALL_BOOK,
  CREATE_ISSUANCE,
} from "../api/ApiConstants";

function UsersTable({ showPagination = true, refresh, searchTerm, setLoading }) {
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
  const [issueDate, setIssueDate] = useState(''); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookOptions, setBookOptions] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [isError, setIsError] = useState(false);
  const [isMessage, setIsMessage] = useState(false);



  //Get API
  const fetchData = () => {

    setLoading(true);
    getRequest(
      `${GET_USER}?page=${currentPage}&size=6&sortBy=id&sortDir=desc&search=${
        searchTerm || ""
      }`,
      (response) => {
        if (response?.status === 200 || 201) {
          setData(
            response.data.content.map((user, index) => ({
              sno: index + 1 + currentPage * 6,
              id: user.id,
              name: user.name,
              mobileNumber: user.mobileNumber,
              email: user.email,
              role: user.role,
              password: user.password,
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
    const fetchBooks = () => {
      getRequest(`${GET_ALL_BOOK}`, (response) => {
        if (response?.status === 200 || response?.status === 201) {
          const options = response.data.map(book => ({
            value: book.id.toString(),
            label: book.title
          }));
          setBooks(response.data);
          setBookOptions(options);
        }
      });
    };
    fetchBooks();
  }, [isAssignModalOpen]);

  
  const handleBookSelect = (selectedOption) => {
    setBookname(selectedOption.value);
  };

  const validateEditForm = () => {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    const trimmedName = name.trim();

    if (!trimmedName || !mobileNumber || !email) {
      setMessage("Please fill all the fields!");
      setIsError(true);
      setIsMessage(true)
      return false;
    }
    if (specialCharacterRegex.test(name) || specialCharacterRegex.test(mobileNumber)) {
      setMessage("Username cannot contain special characters!");
      setIsError(true);
      setIsMessage(true)
      return false;
    }
   
    if (!email) {
      setMessage("Email is required.");
      setIsError(true);
      setIsMessage(true)
      return false;
    } else {
      let atIndex = email.indexOf('@');
      let dotIndex = email.indexOf('.');
  
      if (atIndex === -1 || dotIndex === -1 || email.slice(dotIndex) !== ".com" || dotIndex < atIndex) {
        setMessage("Invalid email format. Domain must end with .com");
        setIsError(true);
        setIsMessage(true)
        return false;
      }
    }

    if (!/^\d+$/.test(mobileNumber)) {
      setMessage("Phone number must contain only digits.");
      setIsMessage(true)
      setIsError(true);
      return false;
    }else if (mobileNumber.length <10){
      setMessage("Phone number must be 10 digits long");
      setIsMessage(true);
      setIsError(true);
      return false;
    }
    return true;
  };


  const validateAssignmentForm = () => {
    const issueDateObj = new Date(issueDate); 
    const returnDateObj = new Date(returnDate);

    
    if (!returnDate  || !issuanceType) {
      setMessage("Please fill all the fields!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }

    if (returnDateObj < issueDateObj) {
      setMessage("Return date cannot be earlier than today!");
      setIsError(true);
      setIsMessage(true);
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
    setIsMessage(false);
    const now = new Date();
    const formattedIssueDate = now.toISOString().slice(0, 16);
    setIssueDate(formattedIssueDate);
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();

    if (!validateAssignmentForm()) {
      return;
    }

   
    const formattedIssuanceType = issuanceType
      .replace(/\s+/g, "-")
      .toUpperCase();

      const formattedReturnDate = returnDate ? new Date(returnDate).toISOString() : "";
      const issuanceData = {
      userId: userId,
      bookId: parseInt(bookname),
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
  const handleEdit = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setMobileNumber(user.mobileNumber);
    setIsEditModalOpen(true);
    setMessage("");
    setIsMessage(false);

   
  };

  const handleUpdateUser = (e) => {

    e.preventDefault();

    if(!validateEditForm){
      return;
    }
    const updateData = {
      name,
      mobileNumber,
      email,
      role: "ROLE_USER",
    };

    patchRequest(
      `${UPDATE_USER}/${selectedUser.mobileNumber}`,
      updateData,
      (response) => {
        if (response?.status === 200  || response?.status === 201) {
         
          setMessage(response?.data.statusMsg);
          setIsMessage(true);
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
          setMessage(response?.data.statusMsg);
          setIsError(true);
          setIsMessage(true);
        } else {
          setMessage(response?.data.statusMsg);
          setIsError(true);
          setIsMessage(true);
         
        }
      }
    );
  };

  //Delete Functions
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
    setMessage("");
    setIsMessage(false);
  };
  const handleConfirmDelete = () => {
 
    deleteRequest(`${DELETE_USER}/${selectedUser.mobileNumber}`, (response) => {
      if (response?.status === 200 || response?.status === 201) {
        setMessage(response?.data.statusMsg);
        setIsError(false);
        setIsMessage(true);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        fetchData();
      } else if ( response?.status === 405){
        setMessage(response?.data.statusMsg);
        setIsError(true);
        setIsMessage(true);
       
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
        <div className="table-component-actions">
          <Button
            className="table-btn"
            imageSrc={editIcon}
            onClick={() => handleEdit(row)}
            tooltip="edit"
          />
          <Button
            className="table-btn"
            imageSrc={deleteIcon}
            onClick={() => handleDelete(row)}
            tooltip="delete"
          />
          <Button
            className="table-btn"
            imageSrc={historyIcon}
            onClick={() => handleHistory(row)}
            tooltip="view history"
          />
          <Button
            className="table-btn"
            imageSrc={assignIcon}
            onClick={() => handleAssign(row)}
             tooltip="assign book"
          />
        </div>
      ),
    },
  ];
  
  useEffect(()=>{
    // alert(setLoading)
  },[])

  const modalDimension = isMessage ? {height: "600", width:"400px"} : {height: "550", width:"400px"};
  const deleteModalDimension = isMessage ? {height: "280", width:"300px"} : {height: "320", width:"300px"};
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
        height={modalDimension.height}
        width={modalDimension.width}
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
          <div className="modal-button-group">
            <Button className="modal-btn" type="submit" name="Save" />
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
        title="Delete User"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        height={deleteModalDimension.height}
        width={deleteModalDimension.width}
       
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <p>Are you sure you want to delete this user?</p>
        <div className="modal-button-group">
          <Button
            className="modal-btn"
            name="Delete"
            onClick={handleConfirmDelete}
          />
          <Button
            className="modal-btn"
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
        height={modalDimension.height}
        width={modalDimension.width}
       
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
          <Dropdown
            options={bookOptions}
            onSelect={handleBookSelect}
            placeholder="Select Book"
          />


          <label htmlFor="issuanceType">Issuance Type:</label>
          <select
            value={issuanceType}
            onChange={(e) => setIssuanceType(e.target.value)}
          >
            <option value="">Select Issuance Type</option>
            <option value="IN-HOUSE">IN-HOUSE</option>
            <option value="TAKE-AWAY">TAKE-AWAY</option>
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
          {errorMessage && <p>{errorMessage}</p>}
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

export default UsersTable;
