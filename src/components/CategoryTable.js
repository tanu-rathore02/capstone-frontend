import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from './TableComponent';

function CategoryTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8080/api/allCategories', {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        setData(response.data.map(category => ({
          id: category.id,
          categoryName: category.categoryName,
          action: 'edit/delete',
        })));
      } catch (error) {
        console.error('Error fetching the categories', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    // Handle edit action
    console.log(`Edit category with id: ${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/deleteCategory/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting the category', error);
    }
  };

  const columns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Category-Name', accessor: 'categoryName' },
    {
      header: 'Action',
      accessor: 'action',
      Cell: ({ row }) => (
        <div>
          <button onClick={() => handleEdit(row.id)}>Edit</button>
          <button onClick={() => handleDelete(row.id)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="table-container">
      <TableComponent columns={columns} data={data} />
    </div>
  );
}

export default CategoryTable;
