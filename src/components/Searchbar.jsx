import { useState } from 'react';
import '../styles/SearchBar.css';
import SearchIcon from '../assets/seachIcon.svg';

function Searchbar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e) => {
   
    const value = e.target.value.trim();
    setSearchInput(e.target.value); 
  
    if (value.length === 0) {
      setErrorMessage('');
      if (onSearch) {
        onSearch('');  
      }
    } else if (value.length < 3) {
      setErrorMessage('Search term must be at least 3 characters long');
    } else {
      setErrorMessage('');
      if (onSearch) {
        onSearch(value);  
      }
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchInput.length >= 3) {
      onSearch(searchInput);
    }
  };

  return (
    <>
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search"
        value={searchInput}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
  
      <img src={SearchIcon} alt='search' className="search-icon"/>
    </div>
      {errorMessage && <p className="search-error-message">{errorMessage}</p>}
      </>
  );
}

export default Searchbar;
