import app from "../apiClient";

export const getAllCategories = async () => {
  return await app.get("/api/allCategories");
};

export const getByPages = async (currentPage) => {
  return await app.get(`/api/searchCategories?page=${currentPage}`)
}
export const deleteCategory = async (categoryName) => {
  return await app.delete(`/api/deleteCategory/${categoryName}`);
};
export const addCategory = async (categoryData) => {
  return await app.post("/api/createCategory", categoryData);
};
export const updateCategory = async (categoryData, categoryName) => {
  return await app.put(`/lms/categories/name/${categoryName}`, categoryData);
};
export const countCategory = async () => {
  return await app.get("/lms/categories/count");
};