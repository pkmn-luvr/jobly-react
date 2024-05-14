import React from 'react';
import axios from 'axios';
import { render, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CompanyDetail from '../CompanyDetail';

jest.mock('axios');
jest.mock('../JobCard', () => () => <div>JobCard Component</div>);

describe('CompanyDetail', () => {
  const mockCompany = {
    name: "Test Company",
    description: "A great company to work for.",
    jobs: [
      { id: 1, title: "Software Engineer" },
      { id: 2, title: "Product Manager" }
    ]
  };

  test('renders loading state initially', () => {
    axios.get.mockResolvedValueOnce({ data: { company: mockCompany } });
    render(
      <BrowserRouter>
        <CompanyDetail />
      </BrowserRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test('displays an error if the fetch fails', async () => {
    axios.get.mockRejectedValue(new Error("Failed to load company details."));
    render(
      <BrowserRouter>
        <CompanyDetail />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText("Error: Failed to load company details.")).toBeInTheDocument());
  });

  test('renders company details and jobs on successful fetch', async () => {
    axios.get.mockResolvedValueOnce({ data: { company: mockCompany } });
    render(
      <BrowserRouter>
        <CompanyDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockCompany.name)).toBeInTheDocument();
      expect(screen.getByText(mockCompany.description)).toBeInTheDocument();
      expect(screen.getAllByText("JobCard Component").length).toBe(mockCompany.jobs.length);
    });
  });

  test('renders no company found when data is null', async () => {
    axios.get.mockResolvedValueOnce({ data: { company: null } });
    render(
      <BrowserRouter>
        <CompanyDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No company found.")).toBeInTheDocument();
    });
  });
});
