import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import JobsList from '../JobsList';
import JoblyApi from '../../api';


jest.mock('../../api');
jest.mock('../JobCard', () => () => <div>JobCard Component</div>); 
describe('JobsList', () => {
    beforeEach(() => {
        JoblyApi.getJobs.mockClear();
    });

    const mockJobs = [
        { id: 1, title: "Software Engineer", company: { name: "Google" } },
        { id: 2, title: "Photographer", company: { name: "National Geographic" } }
    ];

    test('renders loading state initially', async () => {
        JoblyApi.getJobs.mockResolvedValue({ jobs: [] });
        render(<JobsList />);
        expect(screen.getByText("Loading jobs...")).toBeInTheDocument();
    });

    test('displays jobs on successful fetch', async () => {
        JoblyApi.getJobs.mockResolvedValue({ jobs: mockJobs });
        render(<JobsList />);

        await waitFor(() => {
            expect(screen.getAllByText("JobCard Component").length).toBe(mockJobs.length);
        });
    });

    test('displays an error if the fetch fails', async () => {
        JoblyApi.getJobs.mockRejectedValue(new Error("Failed to load jobs."));
        render(<JobsList />);

        await waitFor(() => {
            expect(screen.getByText("Error: Failed to load jobs.")).toBeInTheDocument();
        });
    });

    test('allows users to search for jobs', async () => {
        const searchTerm = "engineer";
        JoblyApi.getJobs.mockResolvedValue({ jobs: mockJobs });
        render(<JobsList />);

        await waitFor(() => screen.getByPlaceholderText("Search by job title...")); 

        fireEvent.change(screen.getByPlaceholderText("Search by job title..."), { target: { value: searchTerm } });
        fireEvent.click(screen.getByText("Search"));

        expect(JoblyApi.getJobs).toHaveBeenCalledWith({ title: searchTerm });
        await waitFor(() => {
            expect(screen.getAllByText("JobCard Component").length).toBe(mockJobs.length);
        });
    });
});
