import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Searchbar from '../components/Searchbar'; 
import SearchIcon from '../assets/seachIcon.svg';

describe('Searchbar Component', () => {
  
  test('renders Searchbar with input and search icon', () => {
    render(<Searchbar />);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByAltText('search')).toHaveAttribute('src', SearchIcon);
  });

  test('updates input value and calls onSearch with valid input', () => {
    const mockOnSearch = jest.fn();
    render(<Searchbar onSearch={mockOnSearch} />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'React' } });
    
    expect(screen.getByPlaceholderText('Search').value).toBe('React');
    expect(mockOnSearch).toHaveBeenCalledWith('React');
  });

  test('displays error message for input less than 3 characters', () => {
    render(<Searchbar />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Ab' } });

    expect(screen.getByText('Search term must be at least 3 characters long')).toBeInTheDocument();
  });

  test('clears error message for input length of 3 or more characters', () => {
    render(<Searchbar />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Ab' } });
    expect(screen.getByText('Search term must be at least 3 characters long')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Abc' } });
    expect(screen.queryByText('Search term must be at least 3 characters long')).toBeNull();
  });

  test('calls onSearch with input value on Enter key press', () => {
    const mockOnSearch = jest.fn();
    render(<Searchbar onSearch={mockOnSearch} />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'React' } });
    fireEvent.keyDown(screen.getByPlaceholderText('Search'), { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnSearch).toHaveBeenCalledWith('React');
  });

  test('does not call onSearch on Enter key press if input length is less than 3', () => {
    const mockOnSearch = jest.fn();
    render(<Searchbar onSearch={mockOnSearch} />);

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Re' } });
    fireEvent.keyDown(screen.getByPlaceholderText('Search'), { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});

