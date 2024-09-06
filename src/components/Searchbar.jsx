import { useState } from 'react';
import '../styles/SearchBar.css';
import SearchIcon from '../assets/searchIcon.svg';

function Searchbar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length === 0) {
      // If input is cleared, display original data
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
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search"
        value={searchInput}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      <img src={SearchIcon} alt="search" className="search-icon" />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Searchbar;
