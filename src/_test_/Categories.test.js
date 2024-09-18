import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Categories from '../pages/categories/Categories';

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
  
  test('clears input and error message when modal is closed', () => {
    render(<Categories setLoading={setLoadingMock} />);

    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.change(screen.getByLabelText('Category Name'), {
      target: { value: 'Test' },
    });
    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('Category Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    fireEvent.click(screen.getByText('Add Category'));
    expect(screen.getByLabelText('Category Name')).toHaveValue('');
    expect(screen.queryByText('Category name cannot be empty!')).not.toBeInTheDocument();
  });

  test('updates search term when typing in search bar', () => {
    render(<Categories setLoading={setLoadingMock} />);

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(searchInput.value).toBe('test search');
  });

  test('successfully adds a new category', async () => {
    postRequest.mockImplementation((url, data, callback) => {
      callback({ status: 201, data: { statusMsg: 'Category added successfully' } });
    });

    render(<Categories setLoading={setLoadingMock} />);

    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.change(screen.getByLabelText('Category Name'), {
      target: { value: 'New Category' },
    });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('Category added successfully')).toBeInTheDocument();
    });

    expect(postRequest).toHaveBeenCalledWith(
      expect.any(String),
      { categoryName: 'New Category' },
      expect.any(Function)
    );
  });

  test('handles error when adding a category that already exists', async () => {
    postRequest.mockImplementation((url, data, callback) => {
      callback({ status: 409, data: { statusMsg: 'Category already exists' } });
    });

    render(<Categories setLoading={setLoadingMock} />);

    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.change(screen.getByLabelText('Category Name'), {
      target: { value: 'Existing Category' },
    });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('Category already exists')).toBeInTheDocument();
    });
  });
  });
