import React, { useEffect, useState } from "react";
import { getRequest, deleteRequest, putRequest } from "../api/ApiManager"; 
import { GET_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from "../api/ApiConstants"; 
import TableComponent from "./TableComponent";
import Modal from "./Modal";
import Button from "./Button";

function CategoryTable({ showPagination = true, refresh, searchTerm }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchData = () => {
    getRequest(
      `${GET_CATEGORY}?page=${currentPage}&size=8&sortBy=id&sortDir=desc&search=${
        searchTerm || ""
      }`,
      (response) => {
        if (response?.status === 200) {
          setData(
            response.data.content.map((category, index) => ({
              sno: index + 1 + currentPage * 8,
              categoryName: category.categoryName,
              id: category.id,
            }))
          );
          setTotalPages(response.data.totalPages);
        } else {
          console.error("Error fetching the categories", response?.error);
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
  };

  const handleConfirmDelete = () => {
    deleteRequest(`${DELETE_CATEGORY}name/${selectedCategory.categoryName}`, (response) => {
      if (response?.status === 200) {
        setMessage("Category deleted successfully!");
        setIsError(false);
        setTimeout(() => {
          setIsConfirmDeleteModalOpen(false);
          setSelectedCategory(null);
        }, 2000);
        fetchData();
      } else if(response.status === 500){
        setMessage("Error deleting category! Book from this category is issued");
        setIsError(true);
      }else{
        setMessage("Failed to delete this category");
        setIsError(true);
        console.error("Error deleting category", response?.data);
      }
    });
  };


 const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.categoryName);
    setIsEditModalOpen(true);
    setMessage("");
  };


  const handleUpdateCategory = () => {

    const specialCharacterRegex = /[^a-zA-Z0-9 ]/;

    if (categoryName.trim() === "") {
      setMessage("Category name cannot be empty!");
      setIsError(true);
      return;
    }

    if (specialCharacterRegex.test(categoryName)) {
      setMessage("Category name cannot contain special characters!");
      setIsError(true);
      return;
    }

    putRequest(
      `${UPDATE_CATEGORY}${selectedCategory.id}`,
      { categoryName },
      (response) => {
        if (response?.status === 200) {
          setMessage("Category updated successfully!");
          setIsError(false);
          setTimeout(() => {
            setIsEditModalOpen(false);
            setSelectedCategory(null);
            setCategoryName("");
          }, 2000);
          fetchData();
        }else if (response?.status === 409) { 
          setMessage("Category with this name already exists!");
          setIsError(true);
        } 
        else {
          setMessage("Error updating category!");
          setIsError(true);
          console.error("Error updating category", response?.data);
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
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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

      <Modal
        title="Confirm Deletion"
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
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
            className="table-btn"
            onClick={handleConfirmDelete}
          />
          <Button
            name="Cancel"
            className="table-btn"
            onClick={() => setIsConfirmDeleteModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default CategoryTable;
