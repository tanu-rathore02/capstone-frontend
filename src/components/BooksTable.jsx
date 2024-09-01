
import React, { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "./TableComponent";
import Modal from "./Modal";
import Button from "./Button";

function BooksTable({ showPagination = true }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formState, setFormState] = useState({
    title: "",
    author: "",
    availability: "",
    category: ""
  });

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
    setFormState({
      title: book.title,
      author: book.author,
      availability: book.availability,
      category: book.category || ""
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleUpdateBook = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        title: formState.title,
        author: formState.author,
        categoryId: formState.category,
        availability: formState.availability
      };

      await axios.put(
        `http://localhost:8080/api/books/updateBook/${selectedBook.sno}`,
        updateData,
        { headers: { Authorization: token } }
      );

      setIsEditModalOpen(false);
      setSelectedBook(null);
      setFormState({ title: "", author: "", availability: "", category: "" });
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
            name="title"
            placeholder="Title"
            value={formState.title}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formState.author}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formState.category}
            onChange={handleFormChange}
          />
          <input
            type="number"
            name="availability"
            placeholder="Availability"
            value={formState.availability}
            onChange={handleFormChange}
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
        <p>Are you sure you want to delete this Book?</p>
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

