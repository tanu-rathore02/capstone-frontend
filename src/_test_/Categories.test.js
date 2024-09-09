import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Categories from '../pages/categories/Categories';
import { postRequest } from '../../api/ApiManager';



jest.mock('../../api/ApiManager', () => ({
  postRequest: jest.fn(),
}));

describe('Categories Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Categories component', () => {
    render(<Categories />);
    expect(screen.getByText('Add Category')).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
  });

  test('opens modal when "Add Category" button is clicked', () => {
    render(<Categories />);
    fireEvent.click(screen.getByText('Add Category'));
    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  test('closes modal when "Cancel" button is clicked', () => {
    render(<Categories />);
    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add Category')).not.toBeInTheDocument();
  });

  test('shows error message for empty category name', async () => {
    render(<Categories />);
    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.submit(screen.getByRole('form'));

    expect(await screen.findByText('Category name cannot be empty!')).toBeInTheDocument();
  });

  test('shows error message for special characters in category name', async () => {
    render(<Categories />);
    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: 'Test@Category' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(await screen.findByText('Category name cannot contain special characters!')).toBeInTheDocument();
  });

  test('shows success message and closes modal when category is successfully added', async () => {
    postRequest.mockImplementation((url, data, callback) => {
      callback({ status: 200 });
    });

    render(<Categories />);
    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: 'NewCategory' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText('Category added successfully!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText('Add Category')).not.toBeInTheDocument();
    });
  });

  test('shows error message when category already exists', async () => {
    postRequest.mockImplementation((url, data, callback) => {
      callback({ status: 409 });
    });

    render(<Categories />);
    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: 'ExistingCategory' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(await screen.findByText('Category with this name already exists!')).toBeInTheDocument();
  });

  test('shows error message when request fails', async () => {
    postRequest.mockImplementation((url, data, callback) => {
      callback({ status: 500, data: 'Internal Server Error' });
    });

    render(<Categories />);
    fireEvent.click(screen.getByText('Add Category'));
    fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: 'ErrorCategory' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(await screen.findByText('Failed to add category. Please try again')).toBeInTheDocument();
  });
});
