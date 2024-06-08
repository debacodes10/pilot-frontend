import React from 'react'
import "./../../Styles/Dashboard/TopNavigation.css"
import { Link, useNavigate } from 'react-router-dom';

const TopNavigation = () => {
    const navigate = useNavigate();
  return (
    <div className='tn-container'>
        <Link className='tn-add-btn' to="/Task"
            >Add Task
        </Link>
        <button className='tn-add-btn' 
            onClick={() => navigate('/Company')}>
            Add Company
        </button>
        <button className='tn-add-btn'>Add Certificate</button>
    </div>
  )
}

export default TopNavigation