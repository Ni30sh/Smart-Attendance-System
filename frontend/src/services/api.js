import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attendance API calls
export const attendanceAPI = {
  getTodayAttendance: () => api.get('/attendance/today'),
  getAttendanceByDate: (date) => api.get(`/attendance/date/${date}`),
  getAllDates: () => api.get('/attendance/dates'),
  markAttendance: (personName, status) => 
    api.post('/attendance/mark', null, { 
      params: { personName, status } 
    }),
  markAttendanceByFace: (imageData) => 
    api.post('/attendance/mark-by-face', { imageData }),
  exportCSV: (date) => api.get('/attendance/export/csv', { 
    params: { date },
    responseType: 'blob'
  }),
};

// Person API calls
export const personAPI = {
  getAllPersons: () => api.get('/persons'),
  getPersonByName: (name) => api.get(`/persons/${name}`),
  savePerson: (person) => api.post('/persons', person),
  deletePerson: (id) => api.delete(`/persons/${id}`),
};

export default api;