import React, { useState, useEffect } from 'react';
import "./../../Styles/Dashboard/TaskAll.css";
import { FaSearch } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import Applicant from './Applicant';

const TaskAll = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTask, setSearchTask] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDomain, setTaskDomain] = useState("");
  const [taskReq, setTaskReq] = useState("");
  const [stipend, setStipend] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [helpLinks, setHelpLinks] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:3005/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleSearch = () => {
    if (searchTask.trim() !== "") {
      fetch(`http://localhost:3005/api/tasks/${searchTask}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Task not found');
          }
          return response.json();
        })
        .then(data => {
          setSearchResult(data);
          setTaskName(data.name);
          setTaskDescription(data.desc);
          setTaskDomain(data.domain);
          setTaskReq(data.taskReq);
          setStipend(data.stipend);
          setEndDate(data.endDate);
          setHelpLinks(data.helpLinks);  // Set the help links array
        })
        .catch(error => {
          console.error('Error fetching task:', error);
          setSearchResult(null);
          alert(error.message);
        });
    }
  };

  const updateTaskDetails = (taskId) => {
    const body = {
      name: taskName,
      desc: taskDescription,
      domain: taskDomain,
      taskReq: taskReq,
      stipend: stipend,
      endDate: endDate,
      helpLinks: helpLinks,
    };

    fetch(`http://localhost:3005/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        setTasks(tasks.map(task => task.taskId === taskId ? data : task));
        setEditMode(false);
        setSearchResult(null); // Clear the search result to trigger re-render
        setSearchTask(''); // Clear the search input field
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (taskId) => {
    fetch(`http://localhost:3005/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setTasks(tasks.filter(task => task.taskId !== taskId));
        } else {
          console.error('Error deleting task');
        }
      })
      .catch(error => console.error('Error deleting task:', error));
    window.location.reload();
  };

  const handleHelpLinkChange = (index, value) => {
    const newHelpLinks = [...helpLinks];
    newHelpLinks[index] = value;
    setHelpLinks(newHelpLinks);
  };

  const addHelpLink = () => {
    setHelpLinks([...helpLinks, ""]);
  };

  const removeHelpLink = (index) => {
    const newHelpLinks = helpLinks.filter((_, i) => i !== index);
    setHelpLinks(newHelpLinks);
  };

  return (
    <div className='ta-main-container'>
      <h2 style={{ textAlign: 'center' }}><u>Tasks Section</u></h2>
      <div className='ta-container'>
        <div className='ta-half'>
          <h2 style={{ textAlign: "center" }}>All Tasks</h2>
          {tasks.map(task => (
            <div key={task._id} className='ta-all-task-container'>
              <div className='ta-each-task'>
                <div className='ta-each-cat-container'>
                  <h4>Name:</h4>
                  <span>{task.name}</span>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Task ID:</h4>
                  <span>{task.taskId}</span>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Company ID:</h4>
                  <span>{task.companyId}</span>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Company Name:</h4>
                  <span>{task.companyName}</span>
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Task Requirements:</h4>
                  <div className='ta-text-long'>
                    <span>{task.taskReq}</span>
                  </div>
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Description:</h4>
                  <div className='ta-text-long'>
                    <span>{task.desc}</span>
                  </div>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Domain:</h4>
                  <span>{task.domain}</span>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Stipend:</h4>
                  <span>{task.stipend}</span>
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Skill:</h4>
                  <div className='ta-text-bullet-container'>
                    {task.skill.map((skill, index) => (
                      <div className='ta-text-bullet-each' key={index}>
                        <GoDotFill size={20}/>
                        <span className='skill-item'>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Help Links:</h4>
                  <div className='ta-text-bullet-container'>
                    {task.helpLinks.map((link, index) => (
                      <div key={index} className='ta-text-bullet-each'>
                        <GoDotFill size={20}/>
                        <span className='skill-item'>{link}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Nice-To-Haves:</h4>
                  <div className='ta-text-bullet-container'>
                    {task.nice.map((item, index) => (
                      <div className='ta-text-bullet-each' key={index}>
                        <GoDotFill size={20}/>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>End Date:</h4>
                  <span>{task.endDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='ta-half'>
          <h2 style={{ paddingLeft: 8 }}>Search by Task ID</h2>
          <div className='ta-taskid-input-container'>
            <span style={{fontWeight: '600'}}>Task ID : </span>
            <input
              value={searchTask}
              onChange={(e) => setSearchTask(e.target.value)}
              className='ta-search-input'
              placeholder='Enter Task ID'
            />
            <FaSearch size={20} onClick={handleSearch} style={{ cursor: 'pointer' }} color='#607274' />
          </div>
          {searchResult && (
            <div className='ta-search-task-container'>
              <div className='ta-up-del-btn-container'>
                {editMode ? (
                  <>
                    <button onClick={() => updateTaskDetails(searchResult.taskId)} className='ua-update-btn'>Save</button>
                    <button onClick={() => setEditMode(false)} className='ua-delete-btn'>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditMode(true)} className='ua-update-btn'>Update</button>
                    <button onClick={() => deleteTask(searchResult.taskId)} className='ua-delete-btn'>Delete</button>
                  </>
                )}
              </div>
              <div className='ta-each-task'>
                <div className='ta-each-cat-container'>
                  <h4>Name:</h4>
                  {editMode ? (
                    <input value={taskName} onChange={(e) => setTaskName(e.target.value)} className='ta-update-input'/>
                  ) : (
                    <span>{searchResult.name}</span>
                  )}
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Task ID:</h4>
                  <span>{searchResult.taskId}</span>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Company ID:</h4>
                  <span>{searchResult.companyId}</span>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Company Name:</h4>
                  <span>{searchResult.companyName}</span>
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Task Requirements:</h4>
                  <div className='ta-text-long'>
                    {editMode ? (
                      <textarea value={taskReq} onChange={(e) => setTaskReq(e.target.value)} className='ta-update-textarea'/>
                    ) : (
                      <span>{searchResult.taskReq}</span>
                    )}
                  </div>
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Description:</h4>
                  <div className='ta-text-long'>
                    {editMode ? (
                      <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} className='ta-update-textarea' />
                    ) : (
                      <span>{searchResult.desc}</span>
                    )}
                  </div>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Domain:</h4>
                  {editMode ? (
                    <input value={taskDomain} onChange={(e) => setTaskDomain(e.target.value)} className='ta-update-input'/>
                  ) : (
                    <span>{searchResult.domain}</span>
                  )}
                </div>
                <div className='ta-each-cat-container'>
                  <h4>Stipend:</h4>
                  {editMode ? (
                    <input value={stipend} onChange={(e) => setStipend(e.target.value)} className='ta-update-input' type='number'/>
                  ) : (
                    <span>{searchResult.stipend}</span>
                  )}
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Skill:</h4>
                  <div className='ta-text-bullet-container'>
                    {searchResult.skill.map((skill, index) => (
                      <div className='ta-text-bullet-each' key={index}>
                        <GoDotFill size={20}/>
                        <span className='skill-item'>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Help Links:</h4>
                  <div className='ta-text-bullet-container'>
                    {editMode ? (
                      <>
                        {helpLinks.map((link, index) => (
                          <div key={index} className='ta-text-long'>
                            <input
                              value={link}
                              onChange={(e) => handleHelpLinkChange(index, e.target.value)}
                              className='ta-update-input'
                            />
                            <button onClick={() => removeHelpLink(index)} className='ua-delete-btn'>Remove</button>
                          </div>
                        ))}
                        <button onClick={addHelpLink} className='ua-update-btn'>Add Link</button>
                      </>
                    ) : (
                      searchResult.helpLinks.map((link, index) => (
                        <div key={index} className='ta-text-bullet-each'>
                          <GoDotFill size={20}/>
                          <span className='skill-item'>{link}</span>
                      </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='ta-each-cat-container-long'>
                  <h4>Nice-To-Haves:</h4>
                  <div className='ta-text-bullet-container'>
                    {searchResult.nice.map((item, index) => (
                      <div className='ta-text-bullet-each' key={index}>
                        <GoDotFill size={20}/>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='ta-each-cat-container'>
                  <h4>End Date:</h4>
                  {editMode ? (
                    <input value={endDate} onChange={(e) => setEndDate(e.target.value)} className='ta-update-input'/>
                  ) : (
                    <span>{searchResult.endDate}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Applicant />
    </div>
  );
};

export default TaskAll;
