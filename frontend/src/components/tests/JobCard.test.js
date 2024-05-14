import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import JobCard from '../JobCard';
import { useUser } from '../../contexts/UserContext';

jest.mock('../../contexts/UserContext', () => ({
    useUser: jest.fn()
}));

const localStorageMock = (function () {
    let store = {};
    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = String(value);
        },
        clear: function () {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('JobCard', () => {
    const job = { id: 1, title: "Software Engineer", salary: 120000, equity: 0.1 };
    const currentUser = { username: "testuser" };

    beforeEach(() => {
        window.localStorage.clear();
        window.alert = jest.fn(); 
    });

    test('handles apply click correctly', async () => {
        const applyToJobMock = jest.fn(async (username, jobId) => {
            const appliedJobs = JSON.parse(localStorage.getItem(`applied_jobs_${username}`)) || [];
            appliedJobs.push(jobId);
            localStorage.setItem(`applied_jobs_${username}`, JSON.stringify(appliedJobs));
        });
        useUser.mockReturnValue({ currentUser, applyToJob: applyToJobMock });
    
        render(<JobCard job={job} />);
        const applyButton = screen.getByText('Apply');
        fireEvent.click(applyButton);
    
        await waitFor(() => {
            const appliedJobs = JSON.parse(localStorage.getItem(`applied_jobs_${currentUser.username}`));
            expect(appliedJobs).toContain(job.id);
            expect(applyToJobMock).toHaveBeenCalledWith(currentUser.username, job.id);
            expect(window.alert).toHaveBeenCalledWith("You have successfully applied for this job!");
        });
    
        const appliedButton = await screen.findByText('Already Applied');
        expect(appliedButton).toBeInTheDocument();
    });

    test('renders job information correctly', () => {
        useUser.mockReturnValue({ currentUser, applyToJob: jest.fn() });
        render(<JobCard job={job} />);
        expect(screen.getByText(job.title)).toBeInTheDocument();
        expect(screen.getByText(`Salary: $${job.salary}`)).toBeInTheDocument();
        expect(screen.getByText('Equity: 10%')).toBeInTheDocument();
        expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    test('displays error message on failed application', async () => {
        const applyToJobMock = jest.fn().mockRejectedValue(new Error("Failed to apply"));
        useUser.mockReturnValue({ currentUser, applyToJob: applyToJobMock });

        render(<JobCard job={job} />);
        const applyButton = screen.getByText('Apply');
        fireEvent.click(applyButton);

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Failed to apply for the job. Please try again."));
    });
});
