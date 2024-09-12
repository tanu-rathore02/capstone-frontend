
import React from 'react';
import '../styles/TableComponent.css';

const TableComponent = ({ columns, data}) => {
 
  return (
    <div className='table-component-wrapper'>
      <table className="table-component">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.Cell ? col.Cell({ row }) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
  );
};

export default TableComponent;

