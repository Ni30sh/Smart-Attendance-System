import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';

const AttendanceViewer = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodayAttendance();
    loadAvailableDates();
  }, []);

  const loadTodayAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceAPI.getTodayAttendance();
      setAttendanceData(response.data);
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      console.error('Error loading today attendance:', err);
      setError('Failed to load today\'s attendance');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableDates = async () => {
    try {
      const response = await attendanceAPI.getAllDates();
      setAvailableDates(response.data);
    } catch (err) {
      console.error('Error loading available dates:', err);
    }
  };

  const loadAttendanceByDate = async (date) => {
    if (!date) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceAPI.getAttendanceByDate(date);
      setAttendanceData(response.data);
      setSelectedDate(date);
    } catch (err) {
      console.error('Error loading attendance by date:', err);
      setError('Failed to load attendance for selected date');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      const response = await attendanceAPI.exportCSV(selectedDate);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance_${selectedDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setError('Failed to export CSV');
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    return status === 'Present' ? 'badge bg-success' : 'badge bg-warning';
  };

  return (
    <div className="attendance-viewer">
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Date Selection</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="dateSelect" className="form-label">
                  Select Date:
                </label>
                <select
                  id="dateSelect"
                  className="form-select"
                  value={selectedDate}
                  onChange={(e) => loadAttendanceByDate(e.target.value)}
                >
                  <option value="">Select a date</option>
                  <option value={new Date().toISOString().split('T')[0]}>
                    Today ({new Date().toLocaleDateString()})
                  </option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={loadTodayAttendance}
                >
                  <i className="fas fa-calendar-day me-2"></i>
                  Today's Attendance
                </button>
                
                {selectedDate && (
                  <button 
                    className="btn btn-success"
                    onClick={exportToCSV}
                  >
                    <i className="fas fa-download me-2"></i>
                    Export CSV
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Statistics</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <div className="border-end">
                    <h3 className="text-success">
                      {attendanceData.filter(a => a.status === 'Present').length}
                    </h3>
                    <small className="text-muted">Present</small>
                  </div>
                </div>
                <div className="col-6">
                  <h3 className="text-warning">
                    {attendanceData.filter(a => a.status === 'Absent').length}
                  </h3>
                  <small className="text-muted">Absent</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>
            Attendance Records
            {selectedDate && (
              <span className="text-muted ms-2">
                ({new Date(selectedDate).toLocaleDateString()})
              </span>
            )}
          </h5>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={() => selectedDate ? loadAttendanceByDate(selectedDate) : loadTodayAttendance()}
          >
            <i className="fas fa-sync-alt me-1"></i>
            Refresh
          </button>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading attendance data...</p>
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center text-muted">
              <i className="fas fa-clipboard-list fa-3x mb-3"></i>
              <p>No attendance records found for the selected date.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Person Name</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>
                        <i className="fas fa-user me-2"></i>
                        {record.personName}
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(record.status)}>
                          {record.status}
                        </span>
                      </td>
                      <td>{formatDateTime(record.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceViewer;