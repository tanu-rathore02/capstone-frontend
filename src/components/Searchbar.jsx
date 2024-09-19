import { useState, useEffect, useCallback } from 'react';
import '../styles/SearchBar.css';
import SearchIcon from '../assets/seachIcon.svg';

function Searchbar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const debounceSearch = useCallback((value) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      setErrorMessage('');
      onSearch('');
      setDebouncedSearchTerm('')
    } else if (trimmedValue.length < 3) {
      setErrorMessage('Search term must be at least 3 characters long');
    } else {
      setErrorMessage('');
      setDebouncedSearchTerm(trimmedValue);
    }
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearchTerm) {
        onSearch(debouncedSearchTerm);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debounceSearch(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const trimmedValue = searchInput.trim();
      if (trimmedValue.length >= 3) {
        onSearch(trimmedValue);
      } else if (trimmedValue.length === 0) {
        onSearch(''); 
      }
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