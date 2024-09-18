import React, { useState, useEffect } from "react";
import Button from "./Button";
import Modal from "./Modal";
import TableComponent from "./TableComponent";
import "../styles/Modal.css";
import editIcon from "../assets/editIcon.svg";

import deleteIcon from "../assets/deleteIcon.svg";
import { getRequest, deleteRequest, putRequest } from "../api/ApiManager";
import {
  GET_ISSUANCE,
  DELETE_ISSUANCE,
  UPDATE_ISSUANCE,
  GET_ISSUANCE_BY_ID,
} from "../api/ApiConstants";

function IssuancesTable({
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
  const [selectedIssuance, setSelectedIssuance] = useState(null);
  const [status, setStatus] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [message, setMessage] = useState();
  const [isError, setIsError] = useState(false);
  const [isMessage, setIsMessage] = useState(false);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(",", "");
  };

  const fetchData = () => {
    setLoading(true);
    getRequest(
      `${GET_ISSUANCE}?page=${currentPage}&size=6&sortBy=id&sortDir=desc&search=${
        searchTerm || ""
      }`,
      (response) => {
        if (response?.status === 200 || response?.status === 201) {
          const issuances = response.data.content;
          issuances.forEach((issuance) => {});

          setData(
            issuances.map((issuance, index) => ({
              id: issuance.id,
              sno: currentPage * 6 + index + 1,
              users: issuance.users || {},
              books: issuance.books || {},
              issueDate: formatDate(issuance.issueDate),
              returnDate: formatDate(issuance.returnDate),
              status: issuance.status,
              issuanceType: issuance.issuanceType,
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
  }, [currentPage, refresh, searchTerm]);

  const validateForm = () => {
    const currentDateTime = new Date();
    const selectedReturnDate = new Date(returnDate);
    if (selectedReturnDate <= currentDateTime) {
      setMessage("Return date must be greater than the issued date!");
      setIsError(true);
      setIsMessage(true);
      return false;
    }

    return true;
  };

  const handleEdit = async (issuance) => {
  

    let newIssuance = {};

    await getRequest(`${GET_ISSUANCE_BY_ID}${issuance.id}`, (response) => {
      newIssuance = response.data;
      setSelectedIssuance(response.data);
    });

    const formatDateTime = (dateString, time = "15:30:00") => {
      return dateString ? `${dateString}T${time}` : "";
    };

    const formattedReturnDate = formatDateTime(newIssuance.returnDate || "");

    setUserId(newIssuance.users?.id || "");
    setBookId(newIssuance.books?.id || "");
    setReturnDate(formattedReturnDate);
    setStatus(newIssuance.status || "");
    setIssuanceType(newIssuance.issuanceType || "");
    setIsMessage(false);
    setMessage("");
    setIsEditModalOpen(true);
  };

  const handleConfirmEdit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (selectedIssuance) {
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
          
            setMessage(response?.data.statusMsg);
            setIsError(false);
            setIsMessage(true);
            setTimeout(() => {
              setIsEditModalOpen(false);
            }, 2000);

            fetchData();
          } else {
            setMessage(response?.data.statusMsg);
            setIsError(true);
            setIsMessage(true);
          }
        }
      );
    }
  };

  const dataWithSerialNumbers = data?.map((issuance, index) => ({
    ...issuance,
    sno: currentPage * 5 + index + 1,
    users: issuance.users.name,
    books: issuance.books.title,
  }));

  const handleDelete = (issuance) => {
    setSelectedIssuance(issuance);
    setIsDeleteModalOpen(true);
    setMessage("");
    setIsMessage(false);
  };

  const handleConfirmDelete = () => {
    if (selectedIssuance?.id) {
      deleteRequest(`${DELETE_ISSUANCE}${selectedIssuance.id}`, (response) => {
        if (response?.status === 200 || response?.status === 201) {
          setMessage(response?.data.statusMsg);
          setIsError(false);
          setIsMessage(true);
          setTimeout(() => {
            setIsDeleteModalOpen(false);
            setSelectedIssuance(null);
          }, 2000);
          fetchData();
        } else {
          setMessage(response?.data.statusMsg);
          setIsError(true);
          setIsMessage(true);
        }
      });
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
        <div className="table-component-actions">
          <Button
            className="table-btn"
            imageSrc={editIcon}
            onClick={() => handleEdit(row)}
            disabled={row.status === "RETURNED"}
            tooltip={
              row.status === "RETURNED"
                ? "can't edit. book is already returned"
                : "edit"
            }
          />
          <Button
            className="table-btn"
            imageSrc={deleteIcon}
            onClick={() => handleDelete(row)}
            tooltip="delete"
          />
        </div>
      ),
    },
  ];

  const modalDimension = isMessage
    ? { height: "750", width: "400px" }
    : { height: "600", width: "400px" };
  const deleteModalDimension = isMessage
    ? { height: "280", width: "300px" }
    : { height: "320", width: "300px" };

  return (
    <div className="table-container">
      {data.length > 0 ? (
        <>
          <TableComponent columns={columns} data={dataWithSerialNumbers} />
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

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Issuance"
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
            handleConfirmEdit();
          }}
        >
          <label htmlFor="name">Username</label>
          <input
            type="text"
            value={selectedIssuance?.users?.name || ""}
            readOnly
          />

          <label htmlFor="title">Book</label>
          <input
            type="text"
            value={selectedIssuance?.books?.title || ""}
            readOnly
          />

          <label htmlFor="name">Issuance Type</label>
          <input type="text" value={issuanceType} readOnly />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="ISSUED">ISSUED</option>
            <option value="RETURNED">RETURNED</option>
          </select>
          <label htmlFor="returnDate">Return Date</label>
          {issuanceType === "IN-HOUSE" ? (
            <input
              label="Return Time"
              type="time"
              value={returnDate.split("T")[1]} 
              onChange={(e) =>
                setReturnDate(
                  (prevDate) => `${prevDate.split("T")[0]}T${e.target.value}`
                )
              }
            />
          ) : (
            <input
              label="Return Date & Time"
              type="datetime-local"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)} 
              
            />
          )}

          <div className="modal-button-group">
            <Button
              name="Update"
              className="modal-btn"
              onClick={handleConfirmEdit}
            />
            <Button
              name="Cancel"
              className="modal-btn"
              onClick={() => setIsEditModalOpen(false)}
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Issuance"
        height={deleteModalDimension.height}
        width={deleteModalDimension.width}
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <p style={{ color: "black" }}>
          Are you sure you want to delete this issuance?
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
    </div>
  );
}

export default IssuancesTable;
