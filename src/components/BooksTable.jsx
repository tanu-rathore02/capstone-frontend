
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import Modal from "../components/Modal";
import TableComponent from "../components/TableComponent";

function BooksTable({ showPagination = true }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [availability, setAvailability] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/books/allBooks`,
        {
          headers: { Authorization: token },
          params: {
            page: currentPage,
            size: 10,
            sortBy: "id",
            sortDir: "asc",
            search: "",
          },
        }
      );
      setData(
        response.data.content.map((book) => ({
          sno: book.id,
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

  const handleEdit = (book) => {
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setAvailability(book.availability);
    setCategoryId(book.categoryId || '');
    setIsEditModalOpen(true);
  };

  const handleDelete = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateBook = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        title: title,
        author: author,
        categoryId: categoryId,
        availability: availability
      };

      console.log(updateData);
      await axios.put(
        `http://localhost:8080/api/books/updateBook/${selectedBook.sno}`,
        updateData,
        { headers: { Authorization: token } }
      );

      setIsEditModalOpen(false);
      setSelectedBook(null);
      setTitle('');
      setAuthor('');
      setAvailability('');
      setCategoryId('');
      fetchData();
    } catch (error) {
      console.error("Error updating book", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8080/api/books/deleteBook/${selectedBook.sno}`,
        { headers: { Authorization: token } }
      );

      setIsDeleteModalOpen(false);
      setSelectedBook(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting book", error);
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
        title="Edit Book"
        height="300px"
        width="350px"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateBook();
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="CategoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />

         
          <input
            type="number"
            placeholder="Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <Button name="Update" className="page-btn" />
        </form>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Book"
        height="150px"
        width="300px"
      >
        <p>Are you sure you want to delete this book?</p>
        <Button
          name="Delete"
          className="page-btn"
          onClick={handleConfirmDelete}
        />
        <Button
          name="Cancel"
          className="page-btn"
          onClick={() => setIsDeleteModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default BooksTable;
