

import React, { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "./TableComponent";
import Modal from "./Modal";
import Button from "./Button";

function CategoryTable({ showPagination = true, refresh, searchTerm }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState(""); 
  const [isError, setIsError] = useState(false); 

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/categories/allCategories", {
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
        response.data.content.map((category, index) => ({
          sno: index + 1 + currentPage * 8,
          categoryName: category.categoryName,
          id: category.id,
        }))
      );
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching the categories", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, refresh]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.categoryName);
    setIsEditModalOpen(true);
    setMessage(""); 
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/api/categories/deleteCategory/${selectedCategory.id}`, {
        headers: { Authorization: token },
      });

      setMessage("Category deleted successfully!"); 
      setIsError(false);

      // Open success modal and then close it after some delay
      setIsDeleteModalOpen(true);
      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setIsConfirmDeleteModalOpen(false);
        setSelectedCategory(null);
      }, 2000); 

      fetchData();
    } catch (error) {
      setMessage("Error deleting category!");
      setIsError(true);
      console.error("Error deleting category", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (categoryName.trim() === "") {
      setMessage("Category name cannot be empty!"); 
      setIsError(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/categories/updateCategory/${selectedCategory.id}`,
        { categoryName },
        { headers: { Authorization: token } }
      );

      setMessage("Category updated successfully!"); 
      setIsError(false);

      // Open success modal and then close it after some delay
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        setCategoryName("");
      }, 2000); 

      fetchData();
    } catch (error) {
      setMessage("Error updating category!"); 
      setIsError(true);
      console.error("Error updating category", error);
    }
  };

  const columns = [
    { header: "S.no", accessor: "sno" },
    { header: "Category-Name", accessor: "categoryName" },
    {
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <Button className="table-btn" name="Edit" onClick={() => handleEdit(row)} />
          <Button className="table-btn" name="Delete" onClick={() => handleDelete(row)} />
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
              <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
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
          <p className={isError ? "error-message" : "success-message"}>{message}</p>
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
            <Button name="Cancel" className="table-btn" onClick={() => setIsEditModalOpen(false)} />
          </div>
        </form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
      >
        <p style={{ color: "black" }}>
          Deleting this category will also delete all associated books. Are you sure you want to proceed?
        </p>
        <div className="modal-button-group">
          <Button name="Delete" className="table-btn" onClick={handleConfirmDelete} />
          <Button name="Cancel" className="table-btn" onClick={() => setIsConfirmDeleteModalOpen(false)} />
        </div>
      </Modal>

      <Modal
        title="Delete Category"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        {message && (
          <p className={isError ? "error-message" : "success-message"}>{message}</p>
        )}
        <div className="modal-button-group">
          <Button name="Close" className="table-btn" onClick={() => setIsDeleteModalOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}

export default CategoryTable;