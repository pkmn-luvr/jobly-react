import React, { useState, useEffect } from 'react';
import CompanyCard from './CompanyCard';
import JoblyApi from '../api';


const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanies = async (search) => {
    setIsLoading(true);
    setError(null);
    try {
      const companiesRes = await JoblyApi.getCompanies(search);
      setCompanies(companiesRes.companies);
    } catch (error) {
      console.error("Failed to fetch companies", error);
      setError("Could not fetch companies.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    fetchCompanies({ name: searchTerm });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Companies</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by Company Name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {companies.map((company, index) => (
        <CompanyCard key={company.handle || index} company={company} />
      ))}
    </div>
  );
};

export default CompaniesList;
