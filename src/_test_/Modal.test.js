import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Modal from '../components/Modal';


describe('Modal Component', () => {
  
  test('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  test('closes modal on close button click', () => {
    const mockOnClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    fireEvent.click(screen.getByRole('button', { name: /×/ }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays the correct title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  test('applies correct width and height styles', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title" width="400px" height="300px">
        <p>Modal Content</p>
      </Modal>
    );

    // Ensure the modal is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Check if the modal content has the correct styles
    expect(screen.getByRole('dialog')).toHaveStyle('width: 400px');
    expect(screen.getByRole('dialog')).toHaveStyle('height: 300px');
  });
});
