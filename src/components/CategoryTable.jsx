
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from './TableComponent';
import Modal from './Modal';
import Button from './Button';

function CategoryTable({ showPagination = true }) {

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/categories/allCategories`, {
        headers: {
          Authorization: token
        },
        params: {
          page: currentPage,
          size: 10,
          sortBy: "id",
          sortDir: "asc",
          search: "",
        }
      });

      setData(response.data.content.map(category => ({
        sno: category.id,
        categoryName: category.categoryName,
      })));
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching the categories', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.categoryName);
    setIsEditModalOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/categories/updateCategory/${selectedCategory.sno}`,
        { categoryName },
        { headers: { Authorization: token } }
      );

      setIsEditModalOpen(false);
      setSelectedCategory(null);
      setCategoryName('');
      fetchData();
    } catch (error) {
      console.error('Error updating category', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/categories/deleteCategory/${selectedCategory.sno}`, {
        headers: { Authorization: token },
      });

      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting category', error);
    }
  };

  const columns = [
    { header: 'S.no', accessor: 'sno' },
    { header: 'Category-Name', accessor: 'categoryName' },
    {
      header: 'Action',
      Cell: ({ row }) => (
        <div>
          <Button className='table-btn' name='Edit' onClick={() => handleEdit(row)} />
          <Button className='table-btn' name='Delete' onClick={() => handleDelete(row)} />
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
      <TableComponent columns={columns} data={data} />
      {showPagination && (
        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={currentPage === 0}>
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            Next
          </button>
        </div>
      )}
      <Modal
        title="Edit Category"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        height='200px'
        width='300px'
      >
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateCategory(); }}>
          <input
            type='text'
            placeholder='Category Name'
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button name="Update" className="page-btn" />
        </form>
      </Modal>
      <Modal title="Delete Category"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        height='150px'
        width='300px'
      >
        <p>Are you sure you want to delete this category?</p>
        <Button name="Delete" className="page-btn" onClick={handleConfirmDelete} />
        <Button name="Cancel" className="page-btn" onClick={() => setIsDeleteModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default CategoryTable;


