import React, { useState, useEffect } from 'react';
import "./../../Styles/Dashboard/CompanyAll.css";
import { FaSearch } from "react-icons/fa";

const CompanyAll = () => {
  const [companies, setCompanies] = useState([]);
  const [searchCompany, setSearchCompany] = useState("")
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3005/api/company-profiles')
      .then(response => response.json())
      .then(data => setCompanies(data))
      .catch(error => console.error('Error fetching company profiles:', error));
  }, []);

  const handleSearch = () => {
    if (searchCompany.trim() !== "") {
      fetch(`http://localhost:3005/api/company-profiles/${searchCompany}`)
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            setSearchResult(null);
            alert(data.message);
          } else {
            setSearchResult(data);
          }
        })
        .catch(error => {
          console.error('Error fetching company profile:', error);
          setSearchResult(null);
        });
    }
  };

  return (
    <div className='ca-main-container'>
        <h2 style={{textAlign: "center"}}><u>Company Section</u></h2>
    <div className='ca-container'>
        <div className='ca-left-container'>
            <h2 style={{textAlign: "center"}}>All Companies</h2>
      {companies.map(company => (
        // <div key={company._id} className='ca-left-container'>
        <div  className='ca-all-company-container'>
          <div key={company._id} className='ca-all-half'>
            <img src={company.companyLogo} width={100} height={100}/>
          </div>
          <div key={company._id} className='ca-all-half'>
            <div className='ca-all-id'>
                <h4>Company ID:</h4>
                <span>{company.companyId}</span>
            </div>
            <div className='ca-all-text'>
                <h4>Company Name:</h4>
                <span>{company.companyName}</span>
            </div>
          </div>
          </div>
        // </div>
      ))}
      </div>
      <div className='ca-right-container'>
        <h2 style={{paddingLeft: 8,}}>Search by Company ID</h2>
        <div className='ca-right-input-container'>
          <input 
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className='ca-search-input'
            placeholder='Enter Company ID'
          />
          <FaSearch size={20} onClick={handleSearch} style={{ cursor: 'pointer' }} color='#607274' />
        </div>
        {searchResult && (
          <div className='ca-search-result'>
            <h3>Search Result:</h3>
            <div className='ca-all-company-container'>
              <div className='ca-all-half'>
                <img loading="lazy" src={searchResult.companyLogo} width={100} height={100} alt={searchResult.companyName} />
              </div>
              <div className='ca-all-half'>
                <div className='ca-all-id'>
                  <h4>Company ID:</h4>
                  <span>{searchResult.companyId}</span>
                </div>
                <div className='ca-all-text'>
                  <h4>Company Name:</h4>
                  <span>{searchResult.companyName}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default CompanyAll;
