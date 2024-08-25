import React from 'react'
import TableComponent from './TableComponent'

function BooksTable() {
  return (
    <div className='table-container'>
        <TableComponent columns={columns} data={data}/>
    </div>
  );
}


const columns = [
    {header: 'Id', accessor: 'id'},
    {header: 'Title', accessor:'tile'},
    {header: 'Author', accessor:'author'},
    {header: 'Category', accessor: 'category'},
    {header: 'Count', accessor:'count'},
    {header: 'Action', accessor: 'action'}
];


const data = [
    { id: 1, title: 'The Odyssey', author: 'Homer', category: 'Mythology', count: 12, action: 'edit' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', count: 18, action: 'edit' },
    { id: 3, title: 'Cosmos', author: 'Carl Sagan', category: 'Astronomy', count: 9, action: 'edit' },
    { id: 4, title: 'The Iliad', author: 'Homer', category: 'Mythology', count: 10, action: 'edit' },
    { id: 5, title: '1984', author: 'George Orwell', category: 'Fiction', count: 15, action: 'edit' },
    { id: 6, title: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Zoology', count: 7, action: 'edit' },
    { id: 7, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Astronomy', count: 5, action: 'edit' },
    { id: 8, title: 'The Mahabharata', author: 'Vyasa', category: 'Mythology', count: 13, action: 'edit' },
    { id: 9, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', count: 20, action: 'edit' },
    { id: 10, title: 'On the Origin of Species', author: 'Charles Darwin', category: 'Zoology', count: 11, action: 'edit' },
];

export default BooksTable