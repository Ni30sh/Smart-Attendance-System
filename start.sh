#!/bin/bash

# Smart Attendance System Startup Script

echo "🚀 Starting Smart Attendance System..."

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Check required ports
echo "🔍 Checking required ports..."
check_port 3000 || exit 1
check_port 8080 || exit 1
check_port 5000 || exit 1

# Start face recognition service
echo "🎭 Starting Face Recognition Service (Python)..."
cd face-recognition-service
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt
python app.py &
FACE_SERVICE_PID=$!
cd ..

# Wait for face recognition service to start
echo "⏳ Waiting for face recognition service to start..."
sleep 5

# Start Spring Boot backend
echo "☕ Starting Spring Boot Backend..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Start React frontend
echo "⚛️ Starting React Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ All services started!"
echo "📋 Service URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8080"
echo "   - Face Recognition: http://localhost:5000"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    kill $FACE_SERVICE_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "👋 All services stopped"
}

# Trap Ctrl+C and cleanup
trap cleanup INT

# Wait for all processes
wait