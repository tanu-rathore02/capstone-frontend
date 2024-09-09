import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Button from '../components/Button';

describe('Button Component', () => {
  
  test('renders button with text', () => {
    render(<Button name="Click Me" />);

    expect(screen.getByText('Click Me')).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull(); 
  });

  test('renders button with image', () => {
    render(<Button imageSrc="path/to/image.png" altText="icon" />);

    expect(screen.getByRole('img')).toHaveAttribute('src', 'path/to/image.png');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'icon');
    expect(screen.queryByText('Click Me')).toBeNull(); 
  });

  test('handles button click', () => {
    const handleClick = jest.fn();
    render(<Button name="Click Me" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click Me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies active class when active prop is true', () => {
    render(<Button name="Active Button" active={true} />);

    expect(screen.getByText('Active Button')).toHaveClass('active');
  });

  test('applies inactive class when active prop is false', () => {
    render(<Button name="Inactive Button" active={false} />);

    expect(screen.getByText('Inactive Button')).toHaveClass('inactive');
  });

  test('applies custom className', () => {
    render(<Button name="Custom Class" className="custom-class" />);

    expect(screen.getByText('Custom Class')).toHaveClass('custom-class');
  });
});
