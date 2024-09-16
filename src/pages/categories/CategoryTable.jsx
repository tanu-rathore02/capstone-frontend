import React, { useEffect, useState } from "react";
import { getRequest, deleteRequest, putRequest } from "../../api/ApiManager";
import {
  GET_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "../../api/ApiConstants";
import TableComponent from "../../components/TableComponent";
import editIcon from "../../assets/editIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";
import Modal from "../../components/Modal";
import Button from "../../components/Button";

function CategoryTable({
  showPagination = true,
  refresh,
  searchTerm,
  setLoading,
}) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isMessage, setIsMessage] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getRequest(
      `${GET_CATEGORY}?page=${currentPage}&size=6&sortBy=id&sortDir=desc&search=${
        searchTerm || ""
      }`,
      (response) => {
        if (response?.status === 200 || response?.status === 201) {
          setData(
            response.data.content.map((category, index) => ({
              sno: index + 1 + currentPage * 6,
              categoryName: category.categoryName,
              id: category.id,
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

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsConfirmDeleteModalOpen(true);
    setMessage("");
    setIsMessage(false);
  };

  const handleConfirmDelete = () => {
    deleteRequest(`${DELETE_CATEGORY}${selectedCategory.id}`, (response) => {
      if (response?.status === 200  || response?.status === 201) {
        setMessage(response?.data.statusMsg);
        setIsMessage(true);
        setIsError(false);
        setTimeout(() => {
          setIsConfirmDeleteModalOpen(false);
          setSelectedCategory(null);
        }, 2000);
        fetchData();
      } else if (response.status === 405) {
        setTimeout(() => {
          setMessage(
            response?.data.statusMsg
          );
          setIsMessage(true);
          setIsError(true);
        }, 2000);
      } else {
        setTimeout(() => {
          setMessage(response?.data.statusMsg);
          setIsError(true);
          setIsMessage(true);
        }, 2000);
      }
    });
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.categoryName);
    setIsEditModalOpen(true);
    setMessage("");
    setIsMessage(false);
  };

  const handleUpdateCategory = () => {
    const specialCharacterRegex = /[^a-zA-Z0-9 ]/;

    if (categoryName.trim() === "") {
      setMessage("Category name cannot be empty!");
      setIsMessage(true);
      setIsError(true);
      return;
    }

    if (specialCharacterRegex.test(categoryName)) {
      setMessage("Category name cannot contain special characters!");
      setIsMessage(true);
      setIsError(true);
      return;
    }

    const trimmedCategory = categoryName.trim();

    putRequest(
      `${UPDATE_CATEGORY}${selectedCategory.id}`,
      { categoryName: trimmedCategory },
      (response) => {
        if (response?.status === 200 || response?.status === 201) {
          setMessage(response?.data.statusMsg);
          setIsError(false);
          setIsMessage(true);
          setTimeout(() => {
            setIsEditModalOpen(false);
            setSelectedCategory(null);
            setCategoryName("");
          }, 2000);
          fetchData();
        } else if (response?.status === 409) {
          setMessage(response?.data.statusMsg);
          setIsMessage(true);
          setIsError(true);
        } else {
          setMessage(response?.data.statusMsg);
          setIsError(true);
          setIsMessage(true);
        }
      }
    );
  };

  const columns = [
    { header: "S.no", accessor: "sno" },
    { header: "Category Name", accessor: "categoryName" },
    {
      header: "Action",
      Cell: ({ row }) => (
        <div className="table-component-actions">
          <Button
            className="table-btn"
            imageSrc={editIcon}
            altText="edit"
            onClick={() => handleEdit(row)}
             tooltip="edit"
          />
          <Button
            className="table-btn"
            imageSrc={deleteIcon}
            altText="delete"
            onClick={() => handleDelete(row)}
             tooltip="delete"
          />
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

  const modalDimension = isMessage
    ? { height: "320px", width: "300px" }
    : { height: "280px", width: "300px" };

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

      <Modal
        title="Edit Category"
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateCategory();
          }}
        >
          <label htmlFor="categoryName">Category Name</label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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

      <Modal
        title="Confirm Deletion"
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        height={modalDimension.height}
        width={modalDimension.width}
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        <p style={{ color: "black" }}>
          Deleting this category will also delete all associated books. Are you
          sure you want to proceed?
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
            onClick={() => setIsConfirmDeleteModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default CategoryTable;
