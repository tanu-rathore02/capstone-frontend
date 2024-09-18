import React, { useState, useEffect, useRef } from 'react';
import '../styles/Dropdown.css'; 

const SearchableDropdown = ({ options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    onSelect(option);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  return (
    <div className="searchable-dropdown" ref={dropdownRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={handleToggle}
      />
      {isOpen && (
        <ul className="dropdown-list">
          {filteredOptions.map((option) => (
            <li key={option.value} onClick={() => handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;