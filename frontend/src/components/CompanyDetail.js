import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import JobCard from './JobCard'; 

const CompanyDetail = () => {
  const [company, setCompany] = useState(null);
  const { handle } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3001/companies/${handle}`);
        setCompany(response.data.company);
      } catch (error) {
        console.error("Error fetching company details", error);
        setError("Failed to load company details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [handle]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>; 
  if (!company) return <div>No company found.</div>;

  return (
    <div>
      <h1>{company.name}</h1>
      <p>{company.description}</p>
      <h2>Jobs at {company.name}</h2>
      <div>
        {company.jobs && company.jobs.length > 0 ? (
          company.jobs.map(job => <JobCard key={job.id} job={job} />)
        ) : (
          <p>No current job openings.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
