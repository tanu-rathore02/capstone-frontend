import apiClient from "./apiClient";

//Books API
const getAllBooks = (page= 0, size =10, sortBy = "id", sortDir = "asc", search = "") => {
    return apiClient.get("/books/allBooks", {
        params: {page, size, sortBy, sortDir, search},
 });
};

const getAllCategoriesDD= () => {
    return apiClient.get("/categories/allForDropDown");
  };


const createBook = (bookId, bookData) => {
    return apiClient.post(`/books/createBook`);
}

const updateBook = (bookId, updateData) => {
    return apiClient.put(`/books/updateBook/${bookId}`, updateData);
  };
  
const deleteBook = (bookId) => {
    return apiClient.delete(`/books/deleteBook/${bookId}`);
  };


//Categories API

const getAllCategories = (page= 0, size =10, sortBy = "id", sortDir = "asc", search = "") => {
  return apiClient.get("/categories/allCategories", {
      params: {page, size, sortBy, sortDir, search},
});
};

const createCategory = (id, categoryData) => {
  return apiClient.post(`/categories/createCategory`);
}

const updateCategories = (id, updateData) => {
  return apiClient.put(`/categories/updateCategory/${id}`, updateData);
};

  
const deleteCategory = (id) => {
  return apiClient.delete(`/categories/deleteCategory/${id}`);
};







const apiManager = {
//Books APIs 
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
    getAllCategoriesDD,

//Categories APIs
  getAllCategories,
  createCategory,
  updateCategories,
  deleteCategory
};

export default apiManager;
