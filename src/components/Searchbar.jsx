import React, { useState } from 'react';
import '../styles/SearchBar.css';
import InputField from './InputField';
import Button from './Button';

function Searchbar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <InputField
        type="text"
        placeholder="Search"
        value={searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <Button name= "Search" className= "table-btn" onClick={handleSearch}/> 
    </div>
  );
}

export default Searchbar;
