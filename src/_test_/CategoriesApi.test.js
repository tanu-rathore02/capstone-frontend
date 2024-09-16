import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import YourComponent from './YourComponent'; // Replace with your component file path
import { postRequest, putRequest, deleteRequest, getRequest } from '../api/ApiManager'; // Replace with your API manager path

// Mock the request functions
jest.mock('../api', () => ({
  postRequest: jest.fn(),
  putRequest: jest.fn(),
  deleteRequest: jest.fn(),
  getRequest: jest.fn(),
}));

describe('API Requests Test', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case for postRequest (CREATE_CATEGORY)
  test('creates a category successfully with status 200/201', async () => {
    const mockResponse = { status: 201 }; // Mock successful response
    postRequest.mockImplementation((url, data, callback) => callback(mockResponse));

    const { getByText } = render(<YourComponent />);

    fireEvent.click(getByText('Submit')); // Trigger category creation (assume button text is Submit)

    await waitFor(() => {
      expect(postRequest).toHaveBeenCalled();
      expect(getByText('Category added successfully!')).toBeInTheDocument();
    });
  });

  test('shows error when category already exists (status 409)', async () => {
    const mockResponse = { status: 409 }; // Mock conflict response
    postRequest.mockImplementation((url, data, callback) => callback(mockResponse));

    const { getByText } = render(<YourComponent />);

    fireEvent.click(getByText('Submit')); // Trigger category creation

    await waitFor(() => {
      expect(postRequest).toHaveBeenCalled();
      expect(getByText('Category with this name already exists!')).toBeInTheDocument();
    });
  });

  test('shows generic error on category creation failure', async () => {
    const mockResponse = { status: 500 }; // Mock server error
    postRequest.mockImplementation((url, data, callback) => callback(mockResponse));

    const { getByText } = render(<YourComponent />);

    fireEvent.click(getByText('Submit')); // Trigger category creation

    await waitFor(() => {
      expect(postRequest).toHaveBeenCalled();
      expect(getByText('Failed to add category. Please try again')).toBeInTheDocument();
    });
  });

  // Test case for deleteRequest (DELETE_CATEGORY)
  test('deletes a category successfully with status 200', async () => {
    const mockResponse = { status: 200 }; // Mock successful delete response
    deleteRequest.mockImplementation((url, callback) => callback(mockResponse));

    const { getByText } = render(<YourComponent />);

    fireEvent.click(getByText('Delete')); // Trigger delete action

    await waitFor(() => {
      expect(deleteRequest).toHaveBeenCalled();
      expect(getByText('Category deleted successfully!')).toBeInTheDocument();
    });
  });

  test('shows error when category cannot be deleted due to issued books (status 500)', async () => {
    const mockResponse = { status: 500 }; // Mock error response
    deleteRequest.mockImplementation((url, callback) => callback(mockResponse));

    const { getByText } = render(<YourComponent />);

    fireEvent.click(getByText('Delete')); // Trigger delete action

    await waitFor(() => {
      expect(deleteRequest).toHaveBeenCalled();
      expect(getByText('Error deleting category! Book from this category is issued')).toBeInTheDocument();
    });
  });

  // Test case for getRequest (GET_CATEGORY)
  test('fetches categories successfully', async () => {
    const mockResponse = {
      status: 200,
      data: {
        content: [
          { id: 1, categoryName: 'Science' },
          { id: 2, categoryName: 'Math' }
        ],
        totalPages: 2,
      }
    };
    getRequest.mockImplementation((url, callback) => callback(mockResponse));

    const { getByText } = render(<YourComponent />);

    await waitFor(() => {
      expect(getRequest).toHaveBeenCalled();
      expect(getByText('Science')).toBeInTheDocument();
      expect(getByText('Math')).toBeInTheDocument();
    });
  });

  test('handles error when fetching categories fails', async () => {
    const mockResponse = { status: 500, error: 'Failed to fetch categories' };
    getRequest.mockImplementation((url, callback) => callback(mockResponse));

    const { getByText } = render(<YourComponent />);

    await waitFor(() => {
      expect(getRequest).toHaveBeenCalled();
      // Assuming your component shows an error message
      expect(console.error).toHaveBeenCalledWith("Error fetching the categories", mockResponse.error);
    });
  });

});
