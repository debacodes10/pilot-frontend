import React, { useState, useEffect } from 'react';
import "./../../Styles/Dashboard/TaskAll.css";
import { FaSearch } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const TaskAll = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTask, setSearchTask] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchApplications, setSearchApplications] = useState("");
  const [taskApplications, setTaskApplications] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDomain, setTaskDomain] = useState("");
  const [taskReq, setTaskReq] = useState("");
  const [stipend, setStipend] = useState(0);
  const [endDate, setEndDate] = useState(new Date());

  const [edit2, setEdit2] = useState(false)
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [driveLink, setDriveLink] = useState("")

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
        })
        .catch(error => {
          console.error('Error fetching task:', error);
          setSearchResult(null);
          alert(error.message);
        });
    }
  };

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

  const updateTaskDetails = (taskId) => {
    const body = {
      name: taskName,
      desc: taskDescription,
      domain: taskDomain,
      taskReq: taskReq,
      stipend: stipend,
      endDate: endDate,
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
        // window.location.reload(); // Refresh the page to reflect changes
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (taskId) => {
    console.log(taskId);
    fetch(`http://localhost:3005/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Task deleted');
          setTasks(tasks.filter(task => task.taskId !== taskId));
        } else {
          console.error('Error deleting task');
        }
      })
      .catch(error => console.error('Error deleting task:', error));
    window.location.reload();
  };

  const updateApplication = (applicationId) => {
    const body = {
      studentName: userName,
      studentEmail: email,
      driveLink: driveLink,
    };
  
    fetch(`http://localhost:3005/api/applications/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        // Handle success, maybe update state if necessary
        console.log('Application updated:', data);
        setEdit2(false); // Reset edit mode
      })
      .catch(error => console.error('Error updating application:', error));
  };

  const deleteApplication = (applicationId) => {
    fetch(`http://localhost:3005/api/applications/${applicationId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Application deleted');
          // Handle successful deletion, maybe update state if necessary
        } else {
          console.error('Error deleting application');
        }
      })
      .catch(error => console.error('Error deleting application:', error));
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
                  <div className='ta-text-long'>
                    <span>{task.helpLinks}</span>
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
          <h2 style={{ paddingLeft: 8, }}>Search by Task ID</h2>
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
          {searchResult ? (
            <div className='ta-search-task-container'>
              <div className='ua-up-del-btn-container'>
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
                {editMode? 
                <input value={taskName} onChange={(e) => setTaskName(e.target.value)} className='ta-update-input'/>
                : 
                <span>{searchResult.name}</span>
                }
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
                {editMode? 
                <textarea value={taskReq} onChange={(e) => setTaskReq(e.target.value)} 
                className='ta-update-textarea'/>
                : 
                <span>{searchResult.taskReq}</span>
                }
                </div>
              </div>
              <div className='ta-each-cat-container-long'>
                <h4>Description:</h4>
                <div className='ta-text-long'>
                {editMode? 
                <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}
                className='ta-update-textarea' />
                : 
                <span>{searchResult.desc}</span>
                }
                </div>
              </div>
              <div className='ta-each-cat-container'>
                <h4>Domain:</h4>
                {editMode? 
                <input value={taskDomain} onChange={(e) => setTaskDomain(e.target.value)} className='ta-update-input'/>
                : 
                <span>{searchResult.domain}</span>
                }
              </div>
              <div className='ta-each-cat-container'>
                <h4>Stipend:</h4>
                {editMode? 
                <input value={stipend} onChange={(e) => setStipend(e.target.value)} className='ta-update-input' type='number'/>
                : 
                <span>{searchResult.stipend}</span>
                }
              </div>
              <div className='ta-each-cat-container-long'>
                  <h4>Skill:</h4>
                  <div className='ta-text-buller-container'>
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
                <div className='ta-text-long'>
                {editMode? 
                <input value={searchResult.helpLinks} onChange={(e) => setSearchResult({...searchResult, helpLinks: e.target.value})} />
                : 
                <span>{searchResult.helpLinks}</span>
                }
                </div>
              </div>
              <div className='ta-each-cat-container-long'>
                <h4>Nice-To-Haves:</h4>
                <div className='ta-text-bullet-container'>
                    {searchResult.nice.map((item, index) => (
                      <div className='ta-text-bullet-each' key={index}>
                        <GoDotFill size={20}/>
                      < span>{item}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className='ta-each-cat-container'>
                <h4>End Date:</h4>
                {editMode? 
                <input value={endDate} onChange={(e) => setEndDate(e.target.value)} className='ta-update-input'/>
                : 
                <span>{searchResult.endDate}</span>
                }
              </div>
            </div>
            </div>
            
          ) : null}
        </div>
      </div>
      <div className='ta-bottom'>
        <div className="ta-bottom-left">
            <h2 style={{ paddingLeft: 8, }}>Search Applications by Task ID</h2>
            <div className='ta-taskid-input-container'>
                <span style={{fontWeight: '600'}}>Task ID : </span>
                <input
                value={searchApplications}
                onChange={(e) => setSearchApplications(e.target.value)}
                className='ta-search-input'
                placeholder='Enter Task ID'
                />
                <FaSearch size={20} onClick={handleApplicationSearch} style={{ cursor: 'pointer' }} color='#607274' />
            </div>
          </div>
          {taskApplications.length > 0 && (
            <div className='ta-app-count-container'>
              <h4>Total Applicants: {taskApplications.length}</h4>
              {taskApplications.map(taskApplicant => (
                <div className='ta-each-task-container'>
                  <div className='ua-up-del-btn-container'>
                    {edit2 ? (
                      <>
                        <button onClick={() => updateApplication(searchResult.taskId)} className='ua-update-btn'>Save</button>
                        <button onClick={() => setEdit2(false)} className='ua-delete-btn'>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEdit2(true)} className='ua-update-btn'>Update</button>
                        <button onClick={() => deleteApplication(searchResult.taskId)} className='ua-delete-btn'>Delete</button>
                      </>
                    )}
                  </div>
                  <div key={taskApplicant._id} className='ta-each-task'>
                  <div className='ta-each-cat-container'>
                    <h4>Name:</h4>
                    {edit2 ? 
                    <input value={userName} onChange={(e)=>setUserName(e.target.value)} className='ta-update-input'/>
                    :
                      <span>{taskApplicant.studentName}</span>
                    }
                  </div>
                  <div className='ta-each-cat-container'>
                    <h4>Phone:</h4>
                    <span>{taskApplicant.studentNumber}</span>
                  </div>
                  <div className='ta-each-cat-container'>
                    <h4>Email:</h4>
                    {edit2 ? 
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} className='ta-update-input'/>
                    :
                    <span>{taskApplicant.studentEmail}</span>
                    }
                  </div>
                  <div className='ta-each-cat-container'>
                    <h4>Drive Link:</h4>
                    {edit2 ? 
                    <input value={driveLink} onChange={(e)=>setDriveLink(e.target.value)} className='ta-update-input'/>
                    :
                    <span>{taskApplicant.driveLink}</span>
                    }
                  </div>
                  <div className='ta-each-cat-container'>
                  <h4>Domains:</h4>
                  <div className='ta-text-long'>
                    <span>{taskApplicant.domain}</span>
                  </div>
                </div>
                </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default TaskAll;
