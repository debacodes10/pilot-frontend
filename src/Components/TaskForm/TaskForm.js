import React, { useState, useEffect } from 'react';
import "./../../Styles/TaskForm/TaskForm.css";

const TaskForm = () => {
    const [name, setName] = useState("");
    const [taskId, setTaskId] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [companyName, setCompanyName] = useState(""); // Added state for companyName
    const [taskReq, setTaskReq] = useState("");
    const [desc, setDesc] = useState("");
    const [domain, setDomain] = useState("");
    const [skills, setSkills] = useState([""]);
    const [stipend, setStipend] = useState("");
    const [helpLinks, setHelpLinks] = useState("");
    const [nice, setNice] = useState([""]);
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (companyId) {
            fetch(`http://localhost:3005/api/company-profiles`)
                .then(response => response.json())
                .then(data => {
                    const company = data.find(comp => comp.companyId === companyId);
                    if (company) {
                        setCompanyName(company.companyName);
                    } else {
                        setCompanyName(""); // Clear the company name if no match found
                    }
                })
                .catch(error => console.error('Error fetching company profiles:', error));
        }
    }, [companyId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!companyName) {
            alert('Incorrect company ID entered. Please enter a valid company ID.');
            return;
        }

        const taskData = {
            name: name,
            taskId: taskId,
            companyId: companyId,
            companyName: companyName,
            taskReq: taskReq,
            desc: desc,
            domain: domain,
            skill: skills,
            stipend: stipend,
            helpLinks: helpLinks,
            nice: nice,
            endDate: endDate,
        };

        fetch('http://localhost:3005/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Duplicate taskId') {
                alert('Duplicate task ID');
            } else {
                alert('Task submitted successfully');
                // Optionally, reset the form or provide further feedback to the user here
            }
        })
        .catch(error => console.error('Error:', error));
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        setSkills(newSkills);
    };

    const addSkillInput = () => {
        setSkills([...skills, ""]);
    };

    const handleNiceChange = (index, value) => {
        const newNice = [...nice];
        newNice[index] = value;
        setNice(newNice);
    };

    const addNiceInput = () => {
        setNice([...nice, ""]);
    };

    return (
        <div className='tf-container'>
            <div className='tf-title-container'>
                <h2>Task Form</h2>
            </div>
            <form onSubmit={handleSubmit} className='tf-form'>
                <label>
                    <h4 className='tf-input-title'>Name:</h4>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    <h4 className='tf-input-title'>Task ID:</h4>
                    <input 
                        type="text" 
                        value={taskId} 
                        onChange={(e) => setTaskId(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    <h4 className='tf-input-title'>Company ID:</h4>
                    <input 
                        type="text" 
                        value={companyId} 
                        onChange={(e) => setCompanyId(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    <h4 className='tf-input-title'>Company Name:</h4>
                    <input 
                        type="text" 
                        value={companyName} 
                        readOnly 
                    />
                </label>
                <label>
                    <h4 className='tf-input-title'>Task Requirement:</h4>
                    <textarea 
                        value={taskReq} 
                        onChange={(e) => setTaskReq(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    <h4 className='tf-input-title'>Description:</h4>
                    <textarea 
                        value={desc} 
                        onChange={(e) => setDesc(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    <h4 className='tf-input-title'>Domain:</h4>
                    <input 
                        type="text" 
                        value={domain} 
                        onChange={(e) => setDomain(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    <h4 className='tf-input-title'>Skills:</h4>
                    <div className='tf-dynamic-input'>
                    {skills.map((skill, index) => (
                            <input key={index} 
                                type="text"
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                required
                            />
                    ))}
                    <button className="tf-add-btn" type="button" onClick={addSkillInput}>Add</button>
                    </div>
                </label>
                <label>
                    <h4 className='tf-input-title'>Stipend: </h4>
                    <input 
                        type="number" 
                        value={stipend} 
                        onChange={(e) => setStipend(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    <h4 className='tf-input-title'>Help Links:</h4>
                    <input 
                        type="text" 
                        value={helpLinks} 
                        onChange={(e) => setHelpLinks(e.target.value)} 
                    />
                </label>
                <label>
                    <h4 className='tf-input-title'>Nice-To-Haves:</h4>
                    <div className='tf-dynamic-input'>
                    {nice.map((item, index) => (
                            <input 
                                key={index}
                                type="text"
                                value={item}
                                onChange={(e) => handleNiceChange(index, e.target.value)}
                            /> 
                    ))}
                    <button className="tf-add-btn" type="button" onClick={addNiceInput}>Add</button>
                    </div>
                </label>
                <label>
                    <h4 className='tf-input-title'>End Date:</h4>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                    />
                </label>
                <div className='tf-submit-btn-container'>
                    <button className="tf-submit-btn" type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
