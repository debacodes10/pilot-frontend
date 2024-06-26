import React from 'react'
import TopNavigation from './TopNavigation'
import "./../../Styles/Dashboard/Dashboard.css"
import CompanyAll from './CompanyAll'
import UserAll from './UserAll'
import TaskAll from './TaskAll'
import Discussions from './Discussions'

const Dashboard = () => {
  return (
    <div className='db-container'>
        <TopNavigation />
        <CompanyAll />
        <UserAll />
        <TaskAll />
        <Discussions />
    </div>
  )
}

export default Dashboard