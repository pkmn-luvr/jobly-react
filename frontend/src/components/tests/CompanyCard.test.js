import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import CompanyCard from '../CompanyCard';

describe('CompanyCard', () => {
  const company = {
    handle: "test-company",
    name: "Test Company",
    description: "Sample details about the company."
  };

  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <CompanyCard company={company} />
      </BrowserRouter>
    );
  });

  test('displays the company name and description', () => {
    render(
      <BrowserRouter>
        <CompanyCard company={company} />
      </BrowserRouter>
    );
    expect(screen.getByText(company.name)).toBeInTheDocument();
    expect(screen.getByText(company.description)).toBeInTheDocument();
  });

  test('includes a link to the company details page', () => {
    render(
      <BrowserRouter>
        <CompanyCard company={company} />
      </BrowserRouter>
    );
    const detailLink = screen.getByRole('link', { name: /view details/i });
    expect(detailLink).toBeInTheDocument();
    expect(detailLink.getAttribute('href')).toBe(`/companies/${company.handle}`);
  });
});
