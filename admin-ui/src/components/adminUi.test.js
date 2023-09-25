import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminUi from './adminUi';

test('renders admin ui table component', () => {
    // Arrange
    render(<AdminUi />);

    // Act
    const element = screen.getByTestId('admin-ui-grid');

    // Assert 
    expect(element).toBeInTheDocument();
});
