# Smart Attendance System - Web Application

## Overview
The Smart Attendance System is an intelligent and efficient web application for tracking attendance using facial recognition technology. This modern web-based solution leverages machine learning, computer vision, and a full-stack architecture to identify individuals and mark their attendance automatically.

## 🌟 Features

### Core Features
- **Facial Recognition**: Uses state-of-the-art facial recognition to identify individuals
- **Real-Time Attendance**: Captures attendance in real-time through webcam integration
- **Database Integration**: Stores attendance records in a structured MySQL database
- **Duplicate Prevention**: Automatically overrides attendance for the same individual if already marked
- **Daily Records**: Maintains separate attendance records for each day
- **CSV Export**: Export attendance data to CSV format for external analysis
- **Web Interface**: Modern, responsive web interface accessible from any device

### Web Application Features
- **Multi-tab Interface**: Separate sections for marking attendance, viewing records, and managing persons
- **Real-time Camera Feed**: Live webcam integration for face capture
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **REST API**: Full API support for integration with other systems
- **Modern UI**: Bootstrap-based interface with intuitive navigation

## 🏗️ Technology Stack

### Frontend
- **React.js** - Modern JavaScript framework
- **Bootstrap 5** - UI components and styling
- **Axios** - HTTP client for API calls
- **React-Webcam** - Camera integration

### Backend
- **Spring Boot** - Java-based backend framework
- **Spring Data JPA** - Database abstraction layer
- **MySQL** - Relational database
- **REST APIs** - API endpoints for frontend communication

### Face Recognition Service
- **Python Flask** - Microservice for face recognition
- **OpenCV** - Computer vision library
- **face_recognition** - Python face recognition library
- **NumPy** - Numerical computing

### Database
- **MySQL 8.0** - Primary database
- **JPA/Hibernate** - Object-relational mapping

## 🚀 Quick Start

### Using the Startup Script (Recommended)
```bash
# Clone the repository
git clone https://github.com/Ni30sh/Smart-Attendance-System.git
cd Smart-Attendance-System

# Make the script executable
chmod +x start.sh

# Start all services
./start.sh
```

### Manual Setup
See [SETUP.md](SETUP.md) for detailed installation instructions.

## 📱 Application Access

Once started, access the application components:

- **Web Application**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Face Recognition Service**: http://localhost:5000

## 🎯 How It Works

### 1. Person Registration
- Add person details through the web interface
- Create a folder in `faces/[person_name]/`
- Add 3-5 clear face images to the folder
- Restart the face recognition service

### 2. Attendance Marking
- Open the web application
- Navigate to "Mark Attendance" tab
- Click "Start Camera" to activate webcam
- Click "Mark Attendance" to capture and process faces
- System automatically recognizes faces and marks attendance

### 3. Viewing Records
- Switch to "View Attendance" tab
- Select date or view today's attendance
- Export data to CSV if needed

### 4. Person Management
- Use "Manage Persons" tab to add/remove persons
- View face data status for each person

## 📁 Project Structure

```
Smart-Attendance-System/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/         # Java source code
│   ├── src/main/resources/    # Configuration files
│   └── pom.xml               # Maven dependencies
├── frontend/                  # React frontend
│   ├── src/                  # React source code
│   ├── public/               # Static assets
│   └── package.json          # npm dependencies
├── face-recognition-service/  # Python microservice
│   ├── app.py               # Flask application
│   └── requirements.txt     # Python dependencies
├── faces/                    # Face images directory
│   └── [person_name]/       # Individual person folders
├── main.py                  # Original Python desktop app
├── start.sh                 # Startup script
├── SETUP.md                 # Detailed setup guide
└── README.md               # This file
```

## 🔧 Configuration

### Database Configuration
Update database credentials in:
- `backend/src/main/resources/application.properties`
- `face-recognition-service/app.py`

### Default Configuration
- **Frontend Port**: 3000
- **Backend Port**: 8080
- **Face Recognition Port**: 5000
- **Database**: attendance_system

## 📊 API Endpoints

### Attendance APIs
- `GET /api/attendance/today` - Get today's attendance
- `GET /api/attendance/date/{date}` - Get attendance by specific date
- `POST /api/attendance/mark-by-face` - Mark attendance using face recognition
- `GET /api/attendance/export/csv` - Export attendance to CSV

### Person Management APIs
- `GET /api/persons` - Get all registered persons
- `POST /api/persons` - Add new person
- `DELETE /api/persons/{id}` - Delete person

## 🔒 Security Features

- **Input Validation**: All API inputs are validated
- **CORS Configuration**: Secure cross-origin requests
- **Database Security**: Parameterized queries prevent SQL injection
- **Face Data Encryption**: Face encodings are securely stored

## 🚀 Future Enhancements

- **Mobile App Integration**: Native mobile applications
- **Advanced Analytics**: Dashboards with attendance trends and insights
- **Multi-Camera Support**: Integration with multiple camera sources
- **Cloud Deployment**: Containerized deployment with Docker
- **Authentication System**: User roles and permissions
- **Real-time Notifications**: Email/SMS alerts for attendance
- **Biometric Integration**: Additional biometric authentication methods

## 🤝 Contribution

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit them
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [OpenCV](https://opencv.org/) - Computer vision library
- [face_recognition](https://github.com/ageitgey/face_recognition) - Python face recognition library
- [Spring Boot](https://spring.io/projects/spring-boot) - Java application framework
- [React](https://reactjs.org/) - Frontend JavaScript library
- [Bootstrap](https://getbootstrap.com/) - CSS framework

## 📞 Support

For support and questions:
- Check the [SETUP.md](SETUP.md) guide
- Review the troubleshooting section
- Open an issue on GitHub

---

**Note**: This is a modern web-based evolution of the original Python desktop application, maintaining all core functionality while adding web accessibility and modern architecture.