import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from './TableComponent';

function CategoryTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8080/api/allCategories', {
          headers: {
            Authorization: token
          },
        });
        setData(response.data.map(category => ({
          sno: category.id,
          categoryName: category.categoryName,
          action: 'edit/delete',
        })));
      } catch (error) {
        console.error('Error fetching the categories', error);
      }
    };

    fetchData();
  }, []);

  

  const columns = [
    { header: 'S.no', accessor: 'sno' },
    { header: 'Category-Name', accessor: 'categoryName' },
    {
      header: 'Action',
      accessor: 'action',
      Cell: ({ row }) => (
        <div>
          <button>Edit</button>
          <button>Delete</button>
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
