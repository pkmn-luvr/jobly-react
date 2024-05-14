import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CompaniesList from '../CompaniesList';
import JoblyApi from '../../api';

jest.mock('../../api'); 

describe('CompaniesList', () => {
  const mockCompanies = [
    { handle: "company1", name: "Company One" },
    { handle: "company2", name: "Company Two" },
  ];

  beforeEach(() => {
    JoblyApi.getCompanies.mockClear();
  });

  test('search functionality updates the component and fetches companies', async () => {
    JoblyApi.getCompanies.mockResolvedValue({ companies: mockCompanies });
    render(
      <BrowserRouter>
        <CompaniesList />
      </BrowserRouter>
    );

    await screen.findByText("Loading..."); 
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument()); 

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Search by Company Name..."), { target: { value: 'Company' } });
      fireEvent.click(screen.getByText("Search"));
    });

    await waitFor(() => {
      expect(JoblyApi.getCompanies).toHaveBeenCalledWith({ name: 'Company' });
      expect(screen.getByText("Company One")).toBeInTheDocument();
      expect(screen.getByText("Company Two")).toBeInTheDocument();
    });
  });

  test('displays loading during API request', async () => {
    JoblyApi.getCompanies.mockResolvedValue({ companies: mockCompanies });
    render(
      <BrowserRouter>
        <CompaniesList />
      </BrowserRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Company One")).toBeInTheDocument());
  });

  test('displays error when fetching companies fails', async () => {
    JoblyApi.getCompanies.mockRejectedValue(new Error("Could not fetch companies."));
    render(
      <BrowserRouter>
        <CompaniesList />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText("Error: Could not fetch companies.")).toBeInTheDocument());
  });

  test('fetches companies on component mount', async () => {
    JoblyApi.getCompanies.mockResolvedValue({ companies: mockCompanies });
    render(
      <BrowserRouter>
        <CompaniesList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(JoblyApi.getCompanies).toHaveBeenCalledTimes(1);
    });
  });

  test('renders company cards for each company', async () => {
    JoblyApi.getCompanies.mockResolvedValue({ companies: mockCompanies });
    render(
      <BrowserRouter>
        <CompaniesList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Company One")).toBeInTheDocument();
      expect(screen.getByText("Company Two")).toBeInTheDocument();
    });
  });
});