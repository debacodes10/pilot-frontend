import React, { useState } from 'react';
import "./../../Styles/Dashboard/Discussions.css";
import { FaSearch } from "react-icons/fa";

const Discussions = () => {
    const [searchDiscussions, setSearchDiscussions] = useState("");
    const [taskData, setTaskData] = useState(null);
    const [newAnswers, setNewAnswers] = useState({});

    async function handleDiscussionSearch() {
        try {
            const response = await fetch(`http://localhost:3005/api/tasks/${searchDiscussions}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setTaskData(data);
            } else {
                console.error('Error fetching task data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleAnswerChange = (questionIndex, value) => {
        setNewAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const handleAnswerSubmit = async (questionIndex) => {
        const answer = newAnswers[questionIndex];
        if (!answer) return;
    
        try {
            const response = await fetch(`http://localhost:3005/api/tasks/${taskData.taskId}/discussions`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ discussionIndex: questionIndex, answer }),
            });
    
            if (response.ok) {
                setTaskData(prev => ({
                    ...prev,
                    discussions: prev.discussions.map((discussion, index) =>
                        index === questionIndex ? { ...discussion, answer } : discussion
                    )
                }));
                setNewAnswers(prev => ({
                    ...prev,
                    [questionIndex]: ""
                }));
            } else {
                console.error('Error updating answer');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <div className='d-container'>
            <h2 style={{ textAlign: "center" }}><u>Discussions Section</u></h2>
            <div className='d-container-main'>
                <div className='d-left-container'>
                    <h2 style={{ paddingLeft: 8, }}>Search Discussions by Task ID</h2>
                    <div className='d-taskid-container'>
                        <span style={{ fontWeight: '600' }}>Task ID : </span>
                        <input
                            value={searchDiscussions}
                            onChange={(e) => setSearchDiscussions(e.target.value)}
                            className='ta-search-input'
                            placeholder='Enter Task ID'
                        />
                        <FaSearch size={20} onClick={handleDiscussionSearch} style={{ cursor: 'pointer' }} color='#607274' />
                    </div>
                </div>
                <div className='d-right-container'>
                    {taskData && taskData.discussions.map((discussion, index) => (
                        <div key={index} className='d-item-container'>
                            <p><strong>Username:</strong> {discussion.username}</p>
                            <p><strong>Question:</strong> {discussion.question}</p>
                            {discussion.answer ? (
                                <p><strong>Answer:</strong> {discussion.answer}</p>
                            ) : (
                                <div>
                                    <input
                                        type="text"
                                        value={newAnswers[index] || ""}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        placeholder="Provide an answer"
                                    />
                                    <button onClick={() => handleAnswerSubmit(index)}>Submit Answer</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Discussions;
