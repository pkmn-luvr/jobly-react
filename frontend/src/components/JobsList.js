import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import JoblyApi from '../api';


const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchJobs = async (search) => {
        setIsLoading(true);
        setError(null);
        try {
            const jobsRes = await JoblyApi.getJobs(search);
            setJobs(jobsRes.jobs);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            setError("Failed to load jobs.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();
        fetchJobs({ title: searchTerm });
    };

    if (isLoading) return <div>Loading jobs...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Jobs</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by job title..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            {jobs.map(job => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
};

export default JobsList;
