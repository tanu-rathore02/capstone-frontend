import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Categories from '../pages/categories/Categories';
import Modal from '../components/Modal';
import { postRequest } from '../api/ApiManager';


jest.mock('../components/Navbar', () => () => <div>Navbar</div>);
jest.mock('../components/Header', () => () => <div>Header</div>);
jest.mock('../components/Button', () => ({ name, onClick }) => (
  <button onClick={onClick}>{name}</button>
));
jest.mock('../components/Searchbar', () => ({ onSearch }) => (
  <input onChange={(e) => onSearch(e.target.value)} placeholder="Search" />
));
jest.mock('../pages/categories/CategoryTable', () => () => <div>CategoryTable</div>);
jest.mock('../components/Modal', () => ({ children, title, isOpen }) => (
  isOpen ? <div>{title}{children}</div> : null
));

jest.mock('../api/ApiManager', () => ({
  postRequest: jest.fn(),
}));

describe('Categories Component', () => {
  const setLoadingMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Navbar, Header, and CategoryTable', () => {
    render(<Categories setLoading={setLoadingMock} />);

    expect(screen.getByText('Navbar')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('CategoryTable')).toBeInTheDocument();
  });

  test('opens and closes modal when Add Category is clicked', () => {
    render(<Categories setLoading={setLoadingMock} />);
  
   
    const addButton = screen.getByRole('button', { name: 'Add Category' });
    fireEvent.click(addButton);
  
 
    expect(screen.getByText('Category Name')).toBeInTheDocument();
  

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Category Name')).not.toBeInTheDocument();
  });

  test('displays error if category name is empty', () => {
    render(<Categories setLoading={setLoadingMock} />);

    fireEvent.click(screen.getByText('Add Category'));

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    expect(screen.getByText('Category name cannot be empty!')).toBeInTheDocument();
  });

  test('displays error if category name has special characters', () => {
    render(<Categories setLoading={setLoadingMock} />);

    fireEvent.click(screen.getByText('Add Category'));

    fireEvent.change(screen.getByLabelText('Category Name'), {
      target: { value: 'Invalid@Name' },
    });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    expect(screen.getByText('Category name cannot contain special characters!')).toBeInTheDocument();
  });

  test('submits category successfully', () => {
    postRequest.mockImplementation((url, data, callback) => {
      callback({ status: 201 });
    });

    render(<Categories setLoading={setLoadingMock} />);

    fireEvent.click(screen.getByText('Add Category'));

    fireEvent.change(screen.getByLabelText('Category Name'), {
      target: { value: 'ValidName' },
    });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    expect(screen.getByText('Category added successfully!')).toBeInTheDocument();
    expect(postRequest).toHaveBeenCalledWith(expect.anything(), { categoryName: 'ValidName' }, expect.anything());
  });

  test('displays error when API returns conflict', () => {
    postRequest.mockImplementation((url, data, callback) => {
      callback({ status: 409 });
    });

    render(<Categories setLoading={setLoadingMock} />);

    fireEvent.click(screen.getByText('Add Category'));

    fireEvent.change(screen.getByLabelText('Category Name'), { 
      target: { value: 'DuplicateName' },
    });
    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    expect(screen.getByText('Category with this name already exists!')).toBeInTheDocument();
  });

  test('modal is closed on initial render', () => {
    render(<Categories setLoading={setLoadingMock} />);
    
    expect(screen.queryByText('Category Name')).not.toBeInTheDocument();
  });

  test('calls onSearch with the correct value', () => {
    render(<Categories setLoading={setLoadingMock} />);
  
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
  
    expect(searchInput.value).toBe('test search');
  });

  test('displays generic error message on failed API response', () => {
    postRequest.mockImplementation((url, data, callback) => {
      callback({ status: 500 });
    });
  
    render(<Categories setLoading={setLoadingMock} />);
  
    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'ValidName' } });
    
    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);
  
    expect(screen.getByText('Failed to add category. Please try again')).toBeInTheDocument();
  });

 

  test('should handle multiple open and close events for modal', () => {
    render(<Categories setLoading={setLoadingMock} />);
  

    fireEvent.click(screen.getByText('Add Category'));
    expect(screen.getByText('Category Name')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByText('Category Name')).not.toBeInTheDocument();
  
    fireEvent.click(screen.getByText('Add Category'));
    expect(screen.getByText('Category Name')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByText('Category Name')).not.toBeInTheDocument();
  });
  });
