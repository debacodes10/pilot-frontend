import React, { useState, useEffect } from 'react';
import "./../../Styles/Dashboard/UserAll.css";
import { FaSearch } from "react-icons/fa";

const UserAll = () => {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3005/api/form-data')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleSearch = () => {
    if (searchUser.trim() !== "") {
      fetch(`http://localhost:3005/api/form-data/${searchUser}`)
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
          console.error('Error fetching user data:', error);
          setSearchResult(null);
        });
    }
  };

  

  return (
    <div className='ua-main-container'>
        <h2 style={{textAlign: "center"}}><u>User Section</u></h2>
      <div className='ua-container'>
        <div className='ua-left-container'>
          <h2 style={{textAlign: "center"}}>All Users</h2>
          {users.map(user => (
            <div key={user.phone} className='ua-all-user-container'>
              <div className='ua-all-half'>
                <div className='ua-two-texts'>
                    <div className='ua-all-text'>
                    <h4>Name:</h4>
                    <span>{user.name}</span>
                    </div>
                    <div className='ua-all-text'>
                    <h4>Email:</h4>
                    <span>{user.email}</span>
                    </div>
                </div>
                <div className='ua-two-texts'>
                    <div className='ua-all-text'>
                    <h4>Phone:</h4>
                    <span>{user.phone}</span>
                    </div>
                    <div className='ua-all-text'>
                    <h4>Domains:</h4>
                    <span className='ua-domain'>
                        {user.domains.map((domain, index) => (
                            <span key={index} className='ua-domain-text'>
                            {domain}{index !== user.domains.length - 1 ? ", " : index !== 0 ? "." : ""}
                            </span>
                        ))}
                        </span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='ua-right-container'>
          <h2 style={{paddingLeft: 8,}}>Search by Phone Number</h2>
          <div className='ua-right-input-container'>
            <input 
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className='ua-search-input'
              placeholder='Enter Phone Number'
            />
            <FaSearch size={20} onClick={handleSearch} style={{ cursor: 'pointer' }} color='#607274' />
          </div>
          {searchResult && (
            <div className='ua-search-result'>
              <h3>Search Result:</h3>
              <div className='ua-all-user-container'>
              <div className='ua-all-half'>
                <div className='ua-two-texts'>
                    <div className='ua-all-text'>
                    <h4>Name:</h4>
                    <span>{searchResult.name}</span>
                    </div>
                    <div className='ua-all-text'>
                    <h4>Email:</h4>
                    <span>{searchResult.email}</span>
                    </div>
                </div>
                <div className='ua-two-texts'>
                    <div className='ua-all-text'>
                    <h4>Phone:</h4>
                    <span>{searchResult.phone}</span>
                    </div>
                    <div className='ua-all-text'>
                    <h4>Domains:</h4>
                    <span className='ua-domain'>
                        {searchResult.domains && searchResult.domains.map((domain, index) => (
                            <span key={index}>
                            {domain}{index !== searchResult.domains.length - 1 ? ", " : index !== 0 ? "." : ""}
                            </span>
                        ))}
                        </span>
                    </div>
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

export default UserAll;
