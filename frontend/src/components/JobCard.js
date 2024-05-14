import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import './styles/JobCard.css';

const JobCard = ({ job }) => {
  const { currentUser, applyToJob } = useUser();
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const appliedJobs = JSON.parse(localStorage.getItem(`applied_jobs_${currentUser.username}`)) || [];
      setApplied(appliedJobs.includes(job.id));
    }
  }, [currentUser, job.id]);

  const handleApply = async () => {
    if (currentUser) {
      try {
        await applyToJob(currentUser.username, job.id);
        setApplied(true);
        alert("You have successfully applied for this job!");
      } catch (error) {
        alert("Failed to apply for the job. Please try again.");
      }
    } else {
      alert("You need to be logged in to apply!");
    }
  };

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>Salary: {job.salary ? `$${job.salary}` : 'Not provided'}</p>
      <p>Equity: {job.equity ? `${job.equity * 100}%` : 'None'}</p>
      <button onClick={handleApply} disabled={applied}>
        {applied ? 'Already Applied' : 'Apply'}
      </button>
    </div>
  );
};

export default JobCard;
