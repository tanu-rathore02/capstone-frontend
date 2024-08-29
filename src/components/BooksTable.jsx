import React, { useEffect, useState} from "react";
import axios from "axios";
import TableComponent from "./TableComponent";


function BooksTable() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8080/api/allBooks', {
          headers: {
            Authorization: token
          },
        });
        setData(response.data.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          availability: book.availability,
          action: 'edit/delete',
        })));
      } catch (error) {
        console.error('Error fetching books',error);
      }
    };
    fetchData();
  }, []);

  

  const columns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Title', accessor: 'title' },
    {header: 'Author', accessor: 'author'},
    {header: 'Availability', accessor: 'availability'},
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

export default BooksTable;