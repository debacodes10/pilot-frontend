import React, { useState, useEffect } from 'react';
import "./../../Styles/Dashboard/TaskAll.css";
import { FaSearch } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const TaskAll = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTask, setSearchTask] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [searchApplications, setSearchApplications] = useState("");
  const [applicationResults, setApplicationResults] = useState([]);
  const [taskApplications, setTaskApplications] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3005/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleSearch = () => {
    if (searchTask.trim() !== "") {
      fetch(`http://localhost:3005/api/tasks/${searchTask}`)
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            setSearchResult(null);
            alert(data.message);
          } else {
            setSearchResult(data);
          }
          console.log(data);
        })
        .catch(error => {
          console.error('Error fetching task:', error);
          setSearchResult(null);
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
                  <div className='ta-text-buller-container'>
                    {task.skill.map((skill, index) => (
                      <div className='ta-text-bullet-each'>
                        <GoDotFill size={20}/>
                        <span key={index} className='skill-item'>{skill}</span>
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
                  <div className='ta-text-bullet-container'></div>
                    {task.nice.map((item, index) => (
                      <div className='ta-text-bullet-each'>
                        <GoDotFill size={20}/>
                        <span key={index}>{item}</span>
                      </div>
                    ))}
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
            <div className='ta-each-task'>
              <div className='ta-each-cat-container'>
                <h4>Name:</h4>
                <span>{searchResult.name}</span>
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
                  <span>{searchResult.taskReq}</span>
                </div>
              </div>
              <div className='ta-each-cat-container-long'>
                <h4>Description:</h4>
                <div className='ta-text-long'>
                  <span>{searchResult.desc}</span>
                </div>
              </div>
              <div className='ta-each-cat-container'>
                <h4>Domain:</h4>
                <span>{searchResult.domain}</span>
              </div>
              <div className='ta-each-cat-container'>
                <h4>Stipend:</h4>
                <span>{searchResult.stipend}</span>
              </div>
              <div className='ta-each-cat-container-long'>
                  <h4>Skill:</h4>
                  <div className='ta-text-buller-container'>
                    {searchResult.skill.map((skill, index) => (
                      <div className='ta-text-bullet-each'>
                        <GoDotFill size={20}/>
                        <span key={index} className='skill-item'>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              <div className='ta-each-cat-container-long'>
                <h4>Help Links:</h4>
                <div className='ta-text-long'>
                  <span>{searchResult.helpLinks}</span>
                </div>
              </div>
              <div className='ta-each-cat-container-long'>
                <h4>Nice-To-Haves:</h4>
                <div className='ta-text-bullet-container'>
                    {searchResult.nice.map((item, index) => (
                      <div className='ta-text-bullet-each'>
                        <GoDotFill size={20}/>
                      < span key={index}>{item}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className='ta-each-cat-container'>
                <h4>End Date:</h4>
                <span>{searchResult.endDate}</span>
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
                <div key={taskApplicant._id} className='ta-each-task'>
                  <div className='ta-each-cat-container'>
                    <h4>Name:</h4>
                    <span>{taskApplicant.studentName}</span>
                  </div>
                  <div className='ta-each-cat-container'>
                    <h4>Phone:</h4>
                    <span>{taskApplicant.studentNumber}</span>
                  </div>
                  <div className='ta-each-cat-container'>
                    <h4>Email:</h4>
                    <span>{taskApplicant.studentEmail}</span>
                  </div>
                  <div className='ta-each-cat-container'>
                    <h4>Domains:</h4>
                    <span>{taskApplicant.domain}</span>
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
