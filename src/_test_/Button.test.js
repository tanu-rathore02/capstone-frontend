

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Button from '../components/Button'; 

describe('Button Component', () => {
  
  test('renders button with name text', () => {
    const mockClick = jest.fn();
    render(<Button name="Click Me" onClick={mockClick} />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click Me');
  });

  test('renders button with an image when imageSrc is provided', () => {
    const mockClick = jest.fn();
    render(
      <Button
        name="Click Me"
        imageSrc="https://via.placeholder.com/150"
        altText="Placeholder Image"
        onClick={mockClick}
      />
    );
    const img = screen.getByAltText('Placeholder Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://via.placeholder.com/150');
  });

  test('fires onClick event when button is clicked', () => {
    const mockClick = jest.fn();
    render(<Button name="Click Me" onClick={mockClick} />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  test('applies the active class when the active prop is true', () => {
    render(<Button name="Click Me" active={true} />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('active');
  });

  test('applies the inactive class when the active prop is false', () => {
    render(<Button name="Click Me" active={false} />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('inactive');
  });

  test('applies additional className prop if provided', () => {
    render(<Button name="Click Me" className="custom-class" />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('custom-class');
  });

  test('uses name as alt text for image if altText is not provided', () => {
    render(<Button name="Click Me" imageSrc="https://via.placeholder.com/150" />);
    const img = screen.getByAltText('Click Me');
    expect(img).toBeInTheDocument();
  });

});

