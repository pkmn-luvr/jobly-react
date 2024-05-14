import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormComponent from '../Forms';

describe('FormComponent', () => {
  const mockHandleSubmit = jest.fn();
  const mockOnChange = jest.fn();
  const title = 'Test Form';
  const inputs = [
    {
      label: 'Username',
      type: 'text',
      name: 'username',
      value: '',
      onChange: mockOnChange,
      required: true,
      disabled: false,
    },
    {
      label: 'Password',
      type: 'password',
      name: 'password',
      value: '',
      onChange: mockOnChange,
      required: true,
      disabled: false,
    },
  ];

  beforeEach(() => {
    render(<FormComponent title={title} inputs={inputs} handleSubmit={mockHandleSubmit} />);
  });

  test('renders form title', () => {
    const titleElement = screen.getByRole('heading', { name: title });
    expect(titleElement).toBeInTheDocument();
  });

  test('renders all form inputs', () => {
    inputs.forEach(input => {
      const inputElement = screen.getByLabelText(input.label);
      expect(inputElement).toBeInTheDocument();
    });
  });

  test('handles input changes', () => {
    inputs.forEach(input => {
      const inputElement = screen.getByLabelText(input.label);
      fireEvent.change(inputElement, { target: { value: 'test' } });
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      mockOnChange.mockClear(); // Clear the mock call count after each iteration
    });
  });

  test('calls handleSubmit on form submission', () => {
    const formElement = screen.getByTestId('form');
    fireEvent.submit(formElement);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test('form inputs have the correct attributes', () => {
    inputs.forEach(input => {
      const inputElement = screen.getByLabelText(input.label);
      expect(inputElement).toHaveAttribute('type', input.type);
      expect(inputElement).toHaveAttribute('name', input.name);
      if (input.required) {
        expect(inputElement).toBeRequired();
      } else {
        expect(inputElement).not.toBeRequired();
      }
      if (input.disabled) {
        expect(inputElement).toBeDisabled();
      } else {
        expect(inputElement).not.toBeDisabled();
      }
    });
  });
});
