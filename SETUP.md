# Web Application Installation and Setup Guide

## Prerequisites

### Software Requirements
- **Java 17 or higher** - For Spring Boot backend
- **Node.js 16 or higher** - For React frontend
- **Python 3.8 or higher** - For face recognition service
- **MySQL 8.0** - Database server
- **Maven** - Java build tool (or use included wrapper)

### Hardware Requirements
- **Webcam** - For real-time face capture
- **Minimum 4GB RAM** - For running all services
- **2GB free disk space** - For dependencies and data

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ni30sh/Smart-Attendance-System.git
   cd Smart-Attendance-System
   ```

2. **Setup MySQL Database:**
   ```sql
   CREATE DATABASE attendance_system;
   CREATE USER 'attendance_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON attendance_system.* TO 'attendance_user'@'localhost';
   ```

3. **Configure Database Connection:**
   Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=attendance_user
   spring.datasource.password=your_password
   ```

4. **Setup Face Images:**
   ```bash
   mkdir -p faces/[person_name]
   # Add JPG/PNG images to the person's folder
   ```

5. **Start All Services:**
   ```bash
   ./start.sh
   ```

6. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Face Recognition Service: http://localhost:5000

## Manual Installation

### 1. Backend (Spring Boot)

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### 2. Face Recognition Service (Python)

```bash
cd face-recognition-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm start
```

## Configuration

### Database Configuration
Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/attendance_system
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Face Recognition Service Configuration
Update `face-recognition-service/app.py`:
```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'your_username',
    'password': 'your_password',
    'database': 'attendance_system'
}
```

## Adding New Persons

1. **Create face images directory:**
   ```bash
   mkdir faces/[person_name]
   ```

2. **Add face images:**
   - Add 3-5 clear photos of the person
   - Use JPG or PNG format
   - Ensure good lighting and clear face visibility

3. **Restart face recognition service:**
   - The service will automatically process new images on startup

## API Endpoints

### Attendance Endpoints
- `GET /api/attendance/today` - Get today's attendance
- `GET /api/attendance/date/{date}` - Get attendance by date
- `POST /api/attendance/mark-by-face` - Mark attendance using face recognition
- `GET /api/attendance/export/csv` - Export attendance to CSV

### Person Management Endpoints
- `GET /api/persons` - Get all registered persons
- `POST /api/persons` - Add new person
- `DELETE /api/persons/{id}` - Delete person

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Check if ports 3000, 8080, 5000 are available
   - Kill existing processes: `lsof -ti:PORT | xargs kill`

2. **Database connection errors:**
   - Verify MySQL is running
   - Check database credentials
   - Ensure database exists

3. **Face recognition not working:**
   - Verify Python dependencies are installed
   - Check face images are in correct format
   - Restart face recognition service

4. **Camera not accessible:**
   - Allow browser camera permissions
   - Check if other applications are using the camera

### Performance Optimization

1. **Database optimization:**
   - Add indexes for frequently queried columns
   - Regular cleanup of old attendance records

2. **Face recognition optimization:**
   - Use fewer face images per person (3-5 is optimal)
   - Reduce image resolution if processing is slow

3. **Frontend optimization:**
   - Build for production: `npm run build`
   - Serve static files through nginx or Apache

## Security Considerations

1. **Database security:**
   - Use strong passwords
   - Limit database user privileges
   - Enable SSL connections

2. **Application security:**
   - Use HTTPS in production
   - Implement authentication and authorization
   - Validate all user inputs

3. **Face data security:**
   - Encrypt face encodings in database
   - Implement data retention policies
   - Follow privacy regulations (GDPR, etc.)

## Production Deployment

### Using Docker (Recommended)

1. **Build Docker images:**
   ```bash
   # Backend
   cd backend
   docker build -t smart-attendance-backend .
   
   # Frontend
   cd frontend
   docker build -t smart-attendance-frontend .
   
   # Face Recognition Service
   cd face-recognition-service
   docker build -t smart-attendance-face-service .
   ```

2. **Use Docker Compose:**
   ```bash
   docker-compose up -d
   ```

### Traditional Deployment

1. **Backend:** Deploy WAR file to Tomcat or run as standalone JAR
2. **Frontend:** Build and serve static files through web server
3. **Face Service:** Deploy Python app using gunicorn/uwsgi
4. **Database:** Use managed MySQL service or dedicated server

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Open an issue on GitHub repository

## License

This project is licensed under the MIT License.