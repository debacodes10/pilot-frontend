import logo from './logo.svg';
import './App.css';
import Company from './Components/CompanyForm/Company';
import Task from './Components/TaskForm/Task';
import { useState } from 'react';
import Dashboard from './Components/Dashboard/Dashboard';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Task" element={<Task />} />
            <Route path="/Company" element={<Company />} />
            {/* Add other routes here */}
          </Routes>
    </BrowserRouter>
    // <div>
    //   <Dashboard />
    // </div>
  );
}

export default App;
