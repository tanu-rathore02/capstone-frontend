// import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import Searchbar from '../components/Searchbar'; 
// import SearchIcon from '../assets/searchIcon.svg'; 

// describe('Searchbar Component', () => {
  
//   test('renders Searchbar with input and search icon', () => {
//     render(<Searchbar />);

//     expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
//     expect(screen.getByAltText('search')).toHaveAttribute('src', SearchIcon);
//   });

//   test('updates input value and calls onSearch with valid input', () => {
//     const mockOnSearch = jest.fn();
//     render(<Searchbar onSearch={mockOnSearch} />);

//     fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'React' } });
    
//     expect(screen.getByPlaceholderText('Search').value).toBe('React');
//     expect(mockOnSearch).toHaveBeenCalledWith('React');
//   });

//   test('displays error message for input less than 3 characters', () => {
//     render(<Searchbar />);

//     fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Ab' } });

//     expect(screen.getByText('Search term must be at least 3 characters long')).toBeInTheDocument();
//   });

//   test('clears error message for input length of 3 or more characters', () => {
//     render(<Searchbar />);

//     fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Ab' } });
//     expect(screen.getByText('Search term must be at least 3 characters long')).toBeInTheDocument();

//     fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Abc' } });
//     expect(screen.queryByText('Search term must be at least 3 characters long')).toBeNull();
//   });

//   test('calls onSearch with input value on Enter key press', () => {
//     const mockOnSearch = jest.fn();
//     render(<Searchbar onSearch={mockOnSearch} />);

//     fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'React' } });
//     fireEvent.keyDown(screen.getByPlaceholderText('Search'), { key: 'Enter', code: 'Enter', charCode: 13 });

//     expect(mockOnSearch).toHaveBeenCalledWith('React');
//   });

//   test('does not call onSearch on Enter key press if input length is less than 3', () => {
//     const mockOnSearch = jest.fn();
//     render(<Searchbar onSearch={mockOnSearch} />);

//     fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Re' } });
//     fireEvent.keyDown(screen.getByPlaceholderText('Search'), { key: 'Enter', code: 'Enter', charCode: 13 });

//     expect(mockOnSearch).not.toHaveBeenCalled();
//   });
// });


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Searchbar from '../components/Searchbar'; // adjust the path according to your folder structure

describe('Searchbar Component', () => {
  
  test('renders search input field and search icon', () => {
    render(<Searchbar />);
    
    // Check if input field is rendered
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
    
    // Check if search icon is rendered
    const icon = screen.getByAltText(/search/i);
    expect(icon).toBeInTheDocument();
  });

  test('updates search input value when typing', () => {
    render(<Searchbar />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(input.value).toBe('Hello');
  });

  test('displays error message for input less than 3 characters', () => {
    render(<Searchbar />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'Hi' } });
    
    const errorMessage = screen.getByText(/search term must be at least 3 characters long/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('removes error message when input is 3 or more characters long', () => {
    render(<Searchbar />);
    
    const input = screen.getByPlaceholderText(/search/i);
    
    // First, enter a value less than 3 characters to trigger the error
    fireEvent.change(input, { target: { value: 'Hi' } });
    const errorMessage = screen.getByText(/search term must be at least 3 characters long/i);
    expect(errorMessage).toBeInTheDocument();
    
    // Then, enter a value with 3 or more characters
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(screen.queryByText(/search term must be at least 3 characters long/i)).not.toBeInTheDocument();
  });

  test('fires onSearch callback with the correct value when input is valid', () => {
    const mockOnSearch = jest.fn();
    render(<Searchbar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'React' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('React');
  });

  test('does not call onSearch when input is less than 3 characters long', () => {
    const mockOnSearch = jest.fn();
    render(<Searchbar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'Re' } });
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('fires onSearch when "Enter" key is pressed and input is valid', () => {
    const mockOnSearch = jest.fn();
    render(<Searchbar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'React' } });
    
    // Simulate pressing "Enter"
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnSearch).toHaveBeenCalledWith('React');
  });

  test('does not fire onSearch when "Enter" key is pressed and input is invalid', () => {
    const mockOnSearch = jest.fn();
    render(<Searchbar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'Re' } });
    
    // Simulate pressing "Enter"
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('clears error message when input is empty after being typed', () => {
    render(<Searchbar />);
    
    const input = screen.getByPlaceholderText(/search/i);
    
    // First, enter a value less than 3 characters to trigger the error
    fireEvent.change(input, { target: { value: 'Hi' } });
    const errorMessage = screen.getByText(/search term must be at least 3 characters long/i);
    expect(errorMessage).toBeInTheDocument();
    
    // Then, clear the input
    fireEvent.change(input, { target: { value: '' } });
    
    expect(screen.queryByText(/search term must be at least 3 characters long/i)).not.toBeInTheDocument();
  });

});
