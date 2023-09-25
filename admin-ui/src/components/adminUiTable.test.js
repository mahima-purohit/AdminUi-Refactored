import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AdminUiTable from './adminUiTable';

// Sample table data for testing
const sampleTableData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'Admin',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        role: 'User',
    },
];

// Mocking the required functions and props
const mockHandleInputChange = jest.fn();
const mockHandleSearch = jest.fn();
const mockHandleTableDelete = jest.fn();
const mockResetTableDataState = jest.fn();
const mockResetDataState = jest.fn();

test('renders the table with sample data', () => {
    // Arrange
    // Act 
    render(
        <AdminUiTable
            tableData={sampleTableData}
            handleInputChange={mockHandleInputChange}
            handleSearch={mockHandleSearch}
            handleTableDelete={mockHandleTableDelete}
            resetTableDataState={mockResetTableDataState}
            resetDataState={mockResetDataState}
        />
    );

    // Assert
    // Check if the table headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();

    // Check if the table rows are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('janesmith@example.com')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
});

test('handles search input change', () => {
    // Arrange 
    render(
        <AdminUiTable
            tableData={sampleTableData}
            handleInputChange={mockHandleInputChange}
            handleSearch={mockHandleSearch}
            handleTableDelete={mockHandleTableDelete}
            resetTableDataState={mockResetTableDataState}
            resetDataState={mockResetDataState}
        />
    );

    // Act
    const searchInput = screen.getByLabelText('Search with name, email or role');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);

    // Assert
    expect(mockHandleSearch).toHaveBeenCalledWith('John');
});
