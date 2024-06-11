import React, { useState, useEffect } from 'react';
import "./../../Styles/Dashboard/UserAll.css";
import { FaSearch } from "react-icons/fa";

const UserAll = () => {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userDomains, setUserDomains] = useState("");

  useEffect(() => {
    fetch('http://localhost:3005/api/forms/form-data')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleSearch = () => {
    if (searchUser.trim() !== "") {
      fetch(`http://localhost:3005/api/forms/${searchUser}`)
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            setSearchResult(null);
            alert(data.message);
          } else {
            setSearchResult(data);
            setUserName(data.name);
            setUserEmail(data.email);
            setUserDomains(data.domains.join(", "));
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setSearchResult(null);
        });
    }
  };

  const updateUserDetails = (userId) => {
    const body = {
      name: userName,
      email: userEmail,
      domains: userDomains.split(",").map(domain => domain.trim())
    };

    fetch(`http://localhost:3005/api/forms/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        setUsers(users.map(user => user.phone === userId ? data : user));
        setEditMode(false);
        setSearchResult(null); // Clear the search result to trigger re-render
        setSearchUser(''); // Clear the search input field
        window.location.reload(); // Refresh the page to reflect changes
      })
      .catch(error => console.error('Error updating user:', error));
  };

  const deleteUser = (userId) => {
    fetch(`http://localhost:3005/api/forms/${userId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('User deleted');
          setUsers(users.filter(user => user.phone !== userId));
        } else {
          console.error('Error deleting user');
        }
      })
      .catch(error => console.error('Error deleting user:', error));
      window.location.reload()
  };

  return (
    <div className='ua-main-container'>
      <h2 style={{ textAlign: "center" }}><u>User Section</u></h2>
      <div className='ua-container'>
        <div className='ua-left-container'>
          <h2 style={{ textAlign: "center" }}>All Users</h2>
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
          <h2 style={{ paddingLeft: 8, }}>Search by Phone Number</h2>
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
                <div className='ua-up-del-btn-container'>
                    {editMode ? (
                      <>
                        <button onClick={() => updateUserDetails(searchResult.phone)} className='ua-update-btn'>Save</button>
                        <button onClick={() => {setEditMode(false)
                          // window.location.reload()
                        }} className='ua-delete-btn'>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditMode(true)} className='ua-update-btn'>Update</button>
                        <button onClick={() => deleteUser(searchResult.phone)} className='ua-delete-btn'>Delete</button>
                      </>
                    )}
                  </div>
                  <div className='ua-two-texts'>
                    
                    <div className='ua-all-text'>
                      <h4>Name:</h4>
                      {editMode ? (
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      ) : (
                        <span>{searchResult.name}</span>
                      )}
                    </div>
                    <div className='ua-all-text'>
                      <h4>Email:</h4>
                      {editMode ? (
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                        />
                      ) : (
                        <span>{searchResult.email}</span>
                      )}
                    </div>
                  </div>
                  <div className='ua-two-texts'>
                    <div className='ua-all-text'>
                      <h4>Phone:</h4>
                      <span>{searchResult.phone}</span>
                    </div>
                    <div className='ua-all-text'>
                      <h4>Domains:</h4>
                      {editMode ? (
                        <input
                          type="text"
                          value={userDomains}
                          onChange={(e) => setUserDomains(e.target.value)}
                        />
                      ) : (
                        <span className='ua-domain'>
                          {searchResult.domains && searchResult.domains.map((domain, index) => (
                            <span key={index}>
                              {domain}{index !== searchResult.domains.length - 1 ? ", " : index !== 0 ? "." : ""}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='ua-all-half'>
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
