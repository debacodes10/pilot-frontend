import React, { useState } from 'react';
import "./../../Styles/Dashboard/Applicant.css";
import { FaSearch } from "react-icons/fa";

const Applicant = () => {
    const [searchApplications, setSearchApplications] = useState("");
    const [editMode, setEditMode] = useState(null); // Initialize with null
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [driveLink, setDriveLink] = useState("");
    const [taskApplications, setTaskApplications] = useState([]);

    const handleApplicationSearch = () => {
        if (searchApplications.trim() !== "") {
            fetch(`http://localhost:3005/api/applications`)
                .then(response => response.json())
                .then(data => {
                    const filteredApplications = data.filter(app => app.taskId === searchApplications);
                    setTaskApplications(filteredApplications);
                })
                .catch(error => {
                    console.error('Error fetching applications:', error);
                    setTaskApplications([]);
                });
        }
    };

    const updateApplication = (phone) => {
        const body = {
            studentName: userName,
            studentEmail: email,
            driveLink: driveLink,
        };
        console.log(body);

        fetch(`http://localhost:3005/api/applications/${phone}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then(response => response.json())
            .then(data => {
                // Handle success, maybe update state if necessary
                setEditMode(null); // Reset edit mode
                window.location.reload()
            })
            .catch(error => console.error('Error updating application:', error));
    };

    const deleteApplication = (phone) => {
        fetch(`http://localhost:3005/api/applications/${phone}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    console.log('Application deleted');
                    setTaskApplications(prev => prev.filter(app => app._id !== phone));
                    window.location.reload();
                } else {
                    console.error('Error deleting application');
                }
            })
            .catch(error => console.error('Error deleting application:', error));
    };

    const handleEditClick = (applicant) => {
        setEditMode(applicant._id);
        setUserName(applicant.studentName);
        setEmail(applicant.studentEmail);
        setDriveLink(applicant.driveLink);
    };

    return (
        <div className='a-bottom'>
            <div className="a-bottom-left">
                <h2 style={{ paddingLeft: 8 }}>Search Applications by Task ID</h2>
                <div className='a-taskid-input-container'>
                    <span style={{ fontWeight: '600' }}>Task ID : </span>
                    <input
                        value={searchApplications}
                        onChange={(e) => setSearchApplications(e.target.value)}
                        className='a-search-input'
                        placeholder='Enter Task ID'
                    />
                    <FaSearch size={20} onClick={handleApplicationSearch} style={{ cursor: 'pointer' }} color='#607274' />
                </div>
            </div>
            {taskApplications.length > 0 && (
                <div className='a-app-count-container'>
                    <h4>Total Applicants: {taskApplications.length}</h4>
                    {taskApplications.map(taskApplicant => (
                        <div key={taskApplicant._id} className='a-each-task-container'>
                            <div className='a-up-del-btn-container'>
                                {editMode === taskApplicant._id ? (
                                    <>
                                        <button onClick={() => updateApplication(taskApplicant.studentNumber)} className='a-update-btn'>Save</button>
                                        <button onClick={() => setEditMode(null)} className='a-delete-btn'>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditClick(taskApplicant)} className='a-update-btn'>Update</button>
                                        <button onClick={() => deleteApplication(taskApplicant.studentNumber)} className='a-delete-btn'>Delete</button>
                                    </>
                                )}
                            </div>
                            <div className='a-each-task'>
                                <div className='a-each-cat-container'>
                                    <h4>Name:</h4>
                                    {editMode === taskApplicant._id ? 
                                        <input value={userName} onChange={(e) => setUserName(e.target.value)} className='a-update-input' />
                                        :
                                        <span>{taskApplicant.studentName}</span>
                                    }
                                </div>
                                <div className='a-each-cat-container'>
                                    <h4>Phone:</h4>
                                    <span>{taskApplicant.studentNumber}</span>
                                </div>
                                <div className='a-each-cat-container'>
                                    <h4>Email:</h4>
                                    {editMode === taskApplicant._id ? 
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} className='a-update-input' />
                                        :
                                        <span>{taskApplicant.studentEmail}</span>
                                    }
                                </div>
                                <div className='a-each-cat-container'>
                                    <h4>Drive Link:</h4>
                                    {editMode === taskApplicant._id ? 
                                        <input value={driveLink} onChange={(e) => setDriveLink(e.target.value)} className='a-update-input' />
                                        :
                                        <span>{taskApplicant.driveLink}</span>
                                    }
                                </div>
                                <div className='a-each-cat-container'>
                                    <h4>Domains:</h4>
                                    <div className='a-text-long'>
                                        <span>{taskApplicant.domain}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Applicant;
