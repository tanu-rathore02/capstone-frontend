import React, { useState, useEffect } from "react";
import Button from "./Button";
import Modal from "./Modal";
import TableComponent from "./TableComponent";
import "../styles/Modal.css";
import { getRequest, deleteRequest, putRequest } from "../api/ApiManager";
import { GET_ISSUANCE,  DELETE_ISSUANCE, UPDATE_ISSUANCE } from "../api/ApiConstants";

function IssuancesTable({ showPagination = true, refresh, searchTerm }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIssuance, setSelectedIssuance] = useState(null);
  const [status, setStatus] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  


  
const fetchData = () => {
  const params = {
    page: currentPage,
    size: 8,
    sortBy: "id",
    sortDir: "asc",
    search: searchTerm || "",
  };

  getRequest(
    `${GET_ISSUANCE}?page=${currentPage}&size=6&sortBy=id&sortDir=desc&search=${searchTerm || ""}`, 
    (response) => {
      if (response?.status === 200) {
        const issuances = response.data.content;
        issuances.forEach((issuance) => {
          console.log("Issuance Data:", issuance);
        });

        setData(
          issuances.map((issuance, index) => ({
            id: issuance.id,
            sno: index + 1 + currentPage * 8,
            users: issuance.users?.name || {}, 
            books: issuance.books?.title || {}, 
            issueDate: issuance.issueDate,
            returnDate: issuance.returnDate,
            status: issuance.status,
            issuanceType: issuance.issuanceType,
          }))
        );
        setTotalPages(response.data.totalPages);
      } else {
        console.error("Error fetching issuances", response?.data);
      }
    },
    {
      params, 
    }
  );
};

useEffect(() => {
  fetchData();
}, [currentPage, refresh, searchTerm]);



  const handleEdit = (issuance) => {
  
    const formatDateTime = (dateString, time = "15:30:00") => {
      return dateString ? `${dateString}T${time}` : "";
    };
  

    const formattedReturnDate = formatDateTime(issuance.returnDate || "");

    setSelectedIssuance(issuance); 
    setUserId(issuance.users?.id || ""); 
    setBookId(issuance.books?.id || ""); 
    setReturnDate(formattedReturnDate); 
    setStatus(issuance.status || ""); 
    setIssuanceType(issuance.issuanceType || ""); 
    
    
    setIsEditModalOpen(true);
  };
  
  const handleConfirmEdit = (e) => {
    e.preventDefault();

    console.log("User ID:", userId);
    console.log("Book ID:", bookId);
  
    if (selectedIssuance && userId && bookId) {
      putRequest(
        `${UPDATE_ISSUANCE}${selectedIssuance.id}`, 
        {
          userId, 
          bookId, 
          returnDate,
          status,
          issuanceType,
        },
        (response) => {
          if (response?.status === 200 || response?.status === 201) {
            console.log("Issuance updated:", response.data);
            setIsEditModalOpen(false);
            fetchData(); 
          } else {
            console.error("Error updating issuance", response?.data);
          }
        }
      );
    } else {
      console.error("User ID or Book ID is missing");
    }
  };
  

  
  const handleDelete = (issuance) => {
    setSelectedIssuance(issuance);
    setIsDeleteModalOpen(true);
  };

 
const handleConfirmDelete = () => {
  if (selectedIssuance?.id) {
    deleteRequest(
      `${DELETE_ISSUANCE}${selectedIssuance.id}`, 
      (response) => {
        if (response?.status === 200 || response?.status === 201) {
          console.log("Issuance deleted:", response.data);
          setIsDeleteModalOpen(false);
          setSelectedIssuance(null);
          fetchData(); 
        } else {
          console.error("Error deleting issuance", response?.data);
        }
      }
    );
  }
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
    { header: "S. no.", accessor: "sno" },
    { header: "Users", accessor: "users" }, 
    { header: "Books", accessor: "books" }, 
    { header: "Issued At", accessor: "issueDate" },
    { header: "Returned At", accessor: "returnDate" },
    { header: "Status", accessor: "status" },
    { header: "Issuance Type", accessor: "issuanceType" },
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
      <Modal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  title="Edit Issuance"
  height="450px"
  width="450px"
>
  <label htmlFor="name">Username</label>
  <input type="text" value={selectedIssuance?.users?.name || ""} readOnly />

  <label htmlFor="title">Book</label>
  <input type="text" value={selectedIssuance?.books?.title || ""} readOnly />

  <label htmlFor="name">Issuance Type</label>
  <input type="text" value={issuanceType} readOnly />

  <label htmlFor="returnDate">Return Date</label>
  <input
    type="datetime-local"
    value={returnDate}
    onChange={(e) => setReturnDate(e.target.value)}
  />

  <div>
    <label>Status:</label>
    <input
      type="radio"
      value="ISSUED"
      checked={status === "ISSUED"}
      onChange={(e) => setStatus(e.target.value)}
    />
    <label>ISSUED</label>
    <input
      type="radio"
      value="RETURNED"
      checked={status === "RETURNED"}
      onChange={(e) => setStatus(e.target.value)}
    />
    <label>RETURNED</label>
  </div>
  <div className="modal-button-group">
    <Button name="Update" className="table-btn" onClick={handleConfirmEdit} />
    <Button name="Cancel" className="table-btn" onClick={() => setIsEditModalOpen(false)} />
  </div>
</Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Issuance"
        height="250px"
        width="350px"
      >
        <p style={{ color: "black" }}>
          Are you sure you want to delete this issuance?
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
    </div>
  );
}

export default IssuancesTable;


