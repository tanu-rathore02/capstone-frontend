

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
    

    const title = screen.getByText(/test modal/i);
    expect(title).toBeInTheDocument();
    

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
    

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });


  


});
