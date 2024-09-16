

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Modal from '../components/Modal';

describe('Modal Component', () => {
  
  test('renders modal with title and children when isOpen is true', () => {
    render(
      <Modal isOpen={true} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    
    // Check if the title is rendered
    const title = screen.getByText(/test modal/i);
    expect(title).toBeInTheDocument();
    
    // Check if the children content is rendered
    const content = screen.getByText(/modal content/i);
    expect(content).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.queryByText(/test modal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
  });

  test('closes the modal when the close button is clicked', () => {
    const mockOnClose = jest.fn();
    
    render(
      <Modal isOpen={true} title="Test Modal" onClose={mockOnClose}>
        <p>Modal Content</p>
      </Modal>
    );
    
    // Simulate clicking the close button
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    // Check if the onClose callback is called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('applies correct width and height styles to modal content', () => {
    render(
      <Modal isOpen={true} title="Test Modal" width="500px" height="300px">
        <p>Modal Content</p>
      </Modal>
    );
    
    const modalContent = screen.getByText(/test modal/i).closest('.modal-content');
    
    // Check if the correct styles are applied
    expect(modalContent).toHaveStyle('width: 500px');
    expect(modalContent).toHaveStyle('height: 300px');
  });
  

  test('renders default width and height when not provided', () => {
    render(
      <Modal isOpen={true} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    
    const modalContent = screen.getByText(/test modal/i).closest('.modal-content');
    
    // Check if the default width and height are applied (auto)
    expect(modalContent).toHaveStyle('width: auto');
    expect(modalContent).toHaveStyle('height: auto');
  });

});
