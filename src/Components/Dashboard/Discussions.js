import React, { useState } from 'react';
import "./../../Styles/Dashboard/Discussions.css";
import { FaSearch } from "react-icons/fa";

const Discussions = () => {
    const [searchDiscussions, setSearchDiscussions] = useState("");
    const [taskData, setTaskData] = useState(null);
    const [editModes, setEditModes] = useState({});

    async function handleDiscussionSearch() {
        try {
            const response = await fetch(`http://localhost:3005/api/tasks/${searchDiscussions}`);
            if (response.ok) {
                const data = await response.json();
                setTaskData(data);
            } else {
                console.error('Error fetching task data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleAnswerChange = (questionIndex, value, field) => {
        setTaskData(prev => ({
            ...prev,
            discussions: prev.discussions.map((discussion, index) =>
                index === questionIndex ? { ...discussion, [field]: value } : discussion
            )
        }));
    };

    const handleAnswerSubmit = async (questionIndex) => {
        const discussion = taskData.discussions[questionIndex];
        if (!discussion.answer && !discussion.question) return;
        console.log(discussion);

        try {
            const response = await fetch(`http://localhost:3005/api/tasks/${taskData.taskId}/discussions`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    discussionIndex: questionIndex, 
                    question: discussion.question,
                    answer: discussion.answer 
                }),
            });

            if (response.ok) {
                setEditModes(prev => ({
                    ...prev,
                    [questionIndex]: false
                }));
            } else {
                console.error('Error updating answer');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteDiscussion = async (questionIndex) => {
        try {
            const response = await fetch(`http://localhost:3005/api/tasks/${taskData.taskId}/discussions/${questionIndex}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setTaskData(prev => ({
                    ...prev,
                    discussions: prev.discussions.filter((_, index) => index !== questionIndex)
                }));
            } else {
                console.error('Error deleting discussion');
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
                    <h2 style={{ paddingLeft: 8 }}>Search Discussions by Task ID</h2>
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
                            <div className='ua-up-del-btn-container'>
                                {editModes[index] ? (
                                    <>
                                        <button onClick={() => handleAnswerSubmit(index)} className='d-update-btn'>Save</button>
                                        <button onClick={() => setEditModes(prev => ({ ...prev, [index]: false }))} className='d-delete-btn'>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setEditModes(prev => ({ ...prev, [index]: true }))} className='d-update-btn'>Update</button>
                                        <button onClick={() => handleDeleteDiscussion(index)} className='d-delete-btn'>Delete</button>
                                    </>
                                )}
                            </div>
                            {editModes[index] ? (
                                <>
                                    <p><strong>Username:</strong> {discussion.username}</p>
                                    <div>
                                        <span style={{marginRight: 8}}><strong>Question: </strong></span>
                                        <input
                                            type="text"
                                            value={discussion.question}
                                            onChange={(e) => handleAnswerChange(index, e.target.value, 'question')}
                                            placeholder="Update question"
                                            className='d-change-input'
                                        />
                                    </div>
                                    <div>
                                        <span style={{marginRight: 8}}><strong>Answer: </strong></span>
                                        <input
                                            type="text"
                                            value={discussion.answer}
                                            onChange={(e) => handleAnswerChange(index, e.target.value, 'answer')}
                                            placeholder="Update answer"
                                            className='d-change-input'
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p><strong>Username:</strong> {discussion.username}</p>
                                    <p><strong>Question:</strong> {discussion.question}</p>
                                    <p><strong>Answer:</strong> {discussion.answer}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Discussions;
