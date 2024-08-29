import React,{ useState, useEffect} from 'react'
import axios from 'axios';
import TableComponent from './TableComponent';

function UsersTable() {

    const [data,setData] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:8080/api/users',{
                headers: {
                    Authorization: token
                },
            });
            setData(response.data.map(user => ({
                sno: user.id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                emailId: user.emailId,
                action: 'edit/delete',
            })));
        } catch (error) {
            console.error('Error fetching the users', error);
        }
        };

        fetchData();
    }, []);

    const columns = [
        {header: 'S.no.', accessor: 'sno'},
        {header: 'Name', accessor: 'name'},
        {header: 'Mobile Number', accessor: 'mobileNumber'},
        {header: 'Email Id', accessor: 'emailId'},
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
        <TableComponent columns={columns} data={data}/>
    </div>
  );
}

export default UsersTable;