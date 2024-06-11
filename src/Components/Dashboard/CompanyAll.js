import React, { useState, useEffect } from 'react';
import "./../../Styles/Dashboard/CompanyAll.css";
import { FaSearch } from "react-icons/fa";

const CompanyAll = () => {
  const [companies, setCompanies] = useState([]);
  const [searchCompany, setSearchCompany] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);

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
            setCompanyName(data.companyName);
            setCompanyDescription(data.desc);
            setCompanyLogo(data.companyLogo);
            setLogoPreview(data.companyLogo);
          }
        })
        .catch(error => {
          console.error('Error fetching company profile:', error);
          setSearchResult(null);
        });
    }
  };

  const updateCompanyDetails = (companyId) => {
    const body = {
      companyLogo: logoPreview,
      companyName: companyName,
      desc: companyDescription
    };
  
    fetch(`http://localhost:3005/api/company-profiles/${companyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        setCompanies(companies.map(company => company.companyId === companyId ? data : company));
        setEditMode(false);
        setSearchResult(null); // Clear the search result to trigger re-render
        setSearchCompany(''); // Clear the search input field
        window.location.reload()
      })
      .catch(error => console.error('Error updating company:', error));
  };

  const deleteCompany = (companyId) => {
    fetch(`http://localhost:3005/api/company-profiles/${companyId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setCompanies(companies.filter(company => company.companyId !== companyId));
          window.location.reload()
        } else {
          console.error('Error deleting company');
        }
      })
      .catch(error => console.error('Error deleting company:', error));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='ca-main-container'>
      <h2 style={{ textAlign: "center" }}><u>Company Section</u></h2>
      <div className='ca-container'>
        <div className='ca-left-container'>
          <h2 style={{ textAlign: "center" }}>All Companies</h2>
          {companies.map(company => (
            <div key={company._id} className='ca-all-company-container'>
              <div className='ca-all-half'>
                <img src={company.companyLogo} width={100} height={100} alt={company.companyName} />
              </div>
              <div className='ca-all-half'>
                <div className='ca-all-id'>
                  <h4>Company ID:</h4>
                  <span>{company.companyId}</span>
                </div>
                <div className='ca-all-text'>
                  <h4>Company Name:</h4>
                  <span>{company.companyName}</span>
                </div>
                <div className='ca-desc-text'>
                  <h4>Company Description:</h4>
                  <span className='ca-desc-input'>{company.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='ca-right-container'>
          <h2 style={{ paddingLeft: 8, }}>Search by Company ID</h2>
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
                  <img loading="lazy" src={logoPreview} width={100} height={100} alt={searchResult.companyName} />
                  {editMode && (
                    <input type="file" onChange={handleLogoChange} />
                  )}
                </div>
                <div className='ca-all-half'>
                  <div className='ca-up-del-btn-container'>
                    {editMode ? (
                      <>
                        <button onClick={() => updateCompanyDetails(searchResult.companyId)} className='ca-update-btn'>Save</button>
                        <button onClick={() => {setEditMode(false)
                          window.location.reload()
                        }} className='ca-delete-btn'>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditMode(true)} className='ca-update-btn'>Update</button>
                        <button onClick={() => deleteCompany(searchResult.companyId)} className='ca-delete-btn'>Delete</button>
                      </>
                    )}
                  </div>
                  <div className='ca-all-id'>
                    <h4>Company ID:</h4>
                    <span>{searchResult.companyId}</span>
                  </div>
                  <div className='ca-all-text'>
                    <h4>Company Name:</h4>
                    {editMode ? (
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    ) : (
                      <span>{searchResult.companyName}</span>
                    )}
                  </div>
                  <div className='ca-desc-text'>
                    <h4>Company Description:</h4>
                    {editMode ? (
                      <textarea
                        value={companyDescription}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                      />
                    ) : (
                      <span className='ca-desc-input'>{searchResult.desc}</span>
                    )}
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
