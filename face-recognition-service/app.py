from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import face_recognition
import cv2
import numpy as np
import base64
import io
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Never#55',
    'database': 'attendance_system'
}

def get_db_connection():
    """Get database connection"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None

def load_known_faces():
    """Load known faces from database"""
    conn = get_db_connection()
    if not conn:
        return [], []
    
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT person_name, encoding FROM images_table")
        records = cursor.fetchall()
        
        known_encodings = []
        known_names = []
        
        for person_name, encoding_blob in records:
            encoding = np.frombuffer(encoding_blob, dtype=np.float64)
            known_encodings.append(encoding)
            known_names.append(person_name)
        
        return known_encodings, known_names
    
    except Exception as e:
        print(f"Error loading known faces: {e}")
        return [], []
    
    finally:
        if conn:
            conn.close()

def base64_to_cv2(base64_string):
    """Convert base64 string to OpenCV image"""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64 string
        image_data = base64.b64decode(base64_string)
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(image_data))
        
        # Convert PIL to OpenCV format
        cv2_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        
        return cv2_image
    
    except Exception as e:
        print(f"Error converting base64 to cv2: {e}")
        return None

@app.route('/recognize', methods=['POST'])
def recognize_faces():
    """Recognize faces in uploaded image"""
    try:
        data = request.json
        image_data = data.get('imageData')
        
        if not image_data:
            return jsonify({
                'success': False,
                'message': 'No image data provided',
                'recognizedPersons': []
            })
        
        # Convert base64 to OpenCV image
        frame = base64_to_cv2(image_data)
        
        if frame is None:
            return jsonify({
                'success': False,
                'message': 'Invalid image data',
                'recognizedPersons': []
            })
        
        # Load known faces from database
        known_encodings, known_names = load_known_faces()
        
        if not known_encodings:
            return jsonify({
                'success': False,
                'message': 'No known faces found in database',
                'recognizedPersons': []
            })
        
        # Convert frame to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Detect faces in the frame
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
        recognized_persons = []
        
        for face_encoding in face_encodings:
            # Compare with known faces
            matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.5)
            
            if True in matches:
                match_index = matches.index(True)
                person_name = known_names[match_index]
                
                # Avoid duplicates
                if person_name not in recognized_persons:
                    recognized_persons.append(person_name)
        
        return jsonify({
            'success': True,
            'message': f'Recognized {len(recognized_persons)} person(s)',
            'recognizedPersons': recognized_persons
        })
    
    except Exception as e:
        print(f"Error in face recognition: {e}")
        return jsonify({
            'success': False,
            'message': f'Face recognition error: {str(e)}',
            'recognizedPersons': []
        })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'face-recognition'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)