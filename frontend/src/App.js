import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AttendanceMarker from './components/AttendanceMarker';
import AttendanceViewer from './components/AttendanceViewer';
import PersonManager from './components/PersonManager';

function App() {
  const [activeTab, setActiveTab] = useState('mark');

  return (
    <div className="App">
      <div className="container-fluid">
        <header className="bg-primary text-white py-3 mb-4">
          <div className="container">
            <h1 className="display-4">Smart Attendance System</h1>
            <p className="lead">Facial Recognition Based Attendance Management</p>
          </div>
        </header>

        <div className="container">
          <nav className="nav nav-tabs mb-4">
            <button 
              className={`nav-link ${activeTab === 'mark' ? 'active' : ''}`}
              onClick={() => setActiveTab('mark')}
            >
              Mark Attendance
            </button>
            <button 
              className={`nav-link ${activeTab === 'view' ? 'active' : ''}`}
              onClick={() => setActiveTab('view')}
            >
              View Attendance
            </button>
            <button 
              className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              Manage Persons
            </button>
          </nav>

          <div className="tab-content">
            {activeTab === 'mark' && <AttendanceMarker />}
            {activeTab === 'view' && <AttendanceViewer />}
            {activeTab === 'manage' && <PersonManager />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
