

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CategoryTable from '../pages/categories/CategoryTable'
import { getRequest, deleteRequest, putRequest } from '../../api/ApiManager';
import { GET_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from '../../api/ApiConstants';

// Mocking the API functions
jest.mock('../../api/ApiManager', () => ({
  getRequest: jest.fn(),
  deleteRequest: jest.fn(),
  putRequest: jest.fn(),
}));

describe('CategoryTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CategoryTable component and displays data', async () => {
 
    getRequest.mockImplementation((url, callback) => {
      callback({
        status: 200,
        data: {
          content: [
            { id: 1, categoryName: 'Category 1' },
            { id: 2, categoryName: 'Category 2' }
          ],
          totalPages: 1
        }
      });
    });

    render(<CategoryTable showPagination={true} refresh={false} searchTerm="" />);


    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });
    await waitFor(() => {

        expect(screen.getByText('Category 2')).toBeInTheDocument();
      });
  });

  test('opens edit modal and updates category', async () => {

    getRequest.mockImplementation((url, callback) => {
      callback({
        status: 200,
        data: {
          content: [
            { id: 1, categoryName: 'Category 1' }
          ],
          totalPages: 1
        }
      });
    });
    putRequest.mockImplementation((url, data, callback) => {
      callback({ status: 200 });
    });

    render(<CategoryTable showPagination={true} refresh={false} searchTerm="" />);


    fireEvent.click(screen.getByAltText('edit'));


    fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: 'Updated Category' } });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(screen.getByText('Category updated successfully!')).toBeInTheDocument();
    });
  });

  test('shows error message on update failure', async () => {

    getRequest.mockImplementation((url, callback) => {
      callback({
        status: 200,
        data: {
          content: [
            { id: 1, categoryName: 'Category 1' }
          ],
          totalPages: 1
        }
      });
    });
    putRequest.mockImplementation((url, data, callback) => {
      callback({ status: 409 });
    });

    render(<CategoryTable showPagination={true} refresh={false} searchTerm="" />);

 
    fireEvent.click(screen.getByAltText('edit'));


    fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: 'Existing Category' } });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(screen.getByText('Category with this name already exists!')).toBeInTheDocument();
    });
  });

  test('opens delete confirmation modal and deletes category', async () => {

    getRequest.mockImplementation((url, callback) => {
      callback({
        status: 200,
        data: {
          content: [
            { id: 1, categoryName: 'Category 1' }
          ],
          totalPages: 1
        }
      });
    });
    deleteRequest.mockImplementation((url, callback) => {
      callback({ status: 200 });
    });

    render(<CategoryTable showPagination={true} refresh={false} searchTerm="" />);


    fireEvent.click(screen.getByAltText('delete'));


    fireEvent.click(screen.getByText('Delete'));


    await waitFor(() => {
      expect(screen.getByText('Category deleted successfully!')).toBeInTheDocument();
    });
  });

  test('shows error message on delete failure', async () => {

    getRequest.mockImplementation((url, callback) => {
      callback({
        status: 200,
        data: {
          content: [
            { id: 1, categoryName: 'Category 1' }
          ],
          totalPages: 1
        }
      });
    });
    deleteRequest.mockImplementation((url, callback) => {
      callback({ status: 500 });
    });

    render(<CategoryTable showPagination={true} refresh={false} searchTerm="" />);


    fireEvent.click(screen.getByAltText('delete'));

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.getByText('Error deleting category! Book from this category is issued')).toBeInTheDocument();
    });
  });

  test('handles pagination controls', () => {
    render(<CategoryTable showPagination={true} refresh={false} searchTerm="" />);


    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next'));

  });
});
