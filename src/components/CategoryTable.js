import React from 'react';
import TableComponent from './TableComponent';

function CategoryTable() {
  return (
    <div className="table-container">
      <TableComponent columns={columns} data={data} />
    </div>
  );
}

const columns = [
  { header: 'Id', accessor: 'id' },
  { header: 'Category-Name', accessor: 'categoryName' },
  { header: 'No. of Books', accessor: 'noOfBooks' },
  { header: 'Action', accessor: 'action' },
];

const data = [
  { id: 1, categoryName: 'History', noOfBooks: '24', action: 'edit' },
  { id: 2, categoryName: 'Fiction', noOfBooks: '20', action: 'edit' },
  { id: 3, categoryName: 'Mythology', noOfBooks: '24', action: 'edit' },
  { id: 4, categoryName: 'Politics', noOfBooks: '24', action: 'edit' },
  { id: 5, categoryName: 'Astronomy', noOfBooks: '24', action: 'edit' },
  { id: 6, categoryName: 'Mathematics', noOfBooks: '24', action: 'edit' },
  { id: 7, categoryName: 'Sci-fi', noOfBooks: '24', action: 'edit' },
  { id: 8, categoryName: 'Mystery', noOfBooks: '24', action: 'edit' },
  { id: 9, categoryName: 'Zoology', noOfBooks: '24', action: 'edit' },
  { id: 10, categoryName: 'Literature', noOfBooks: '24', action: 'edit' },
];

export default CategoryTable;
