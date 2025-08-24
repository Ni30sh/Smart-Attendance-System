import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { attendanceAPI } from '../services/api';

const AttendanceMarker = () => {
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCapturedImage, setLastCapturedImage] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      setLastCapturedImage(imageSrc);

      // Remove data URL prefix for API call
      const imageData = imageSrc.split(',')[1];

      const response = await attendanceAPI.markAttendanceByFace(imageData);
      
      if (response.data && Array.isArray(response.data)) {
        setRecognitionResult({
          success: true,
          attendanceMarked: response.data,
          message: `Successfully marked attendance for ${response.data.length} person(s)`
        });
      } else {
        setRecognitionResult({
          success: false,
          message: response.data || 'No faces recognized'
        });
      }
    } catch (err) {
      console.error('Error capturing and recognizing:', err);
      setError('Failed to process face recognition');
      setRecognitionResult({
        success: false,
        message: 'Error processing face recognition'
      });
    } finally {
      setLoading(false);
    }
  }, [webcamRef]);

  const startCapturing = () => {
    setIsCapturing(true);
    setRecognitionResult(null);
    setError(null);
  };

  const stopCapturing = () => {
    setIsCapturing(false);
  };

  return (
    <div className="attendance-marker">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Camera Feed</h5>
            </div>
            <div className="card-body text-center">
              {isCapturing ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  height="auto"
                  className="border rounded"
                />
              ) : (
                <div className="bg-light border rounded d-flex align-items-center justify-content-center" 
                     style={{ height: '400px' }}>
                  <div>
                    <i className="fas fa-camera fa-4x text-muted mb-3"></i>
                    <p className="text-muted">Click "Start Camera" to begin</p>
                  </div>
                </div>
              )}
              
              <div className="mt-3">
                {!isCapturing ? (
                  <button 
                    className="btn btn-primary btn-lg me-2"
                    onClick={startCapturing}
                  >
                    <i className="fas fa-camera me-2"></i>
                    Start Camera
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn btn-success btn-lg me-2"
                      onClick={capture}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-check me-2"></i>
                          Mark Attendance
                        </>
                      )}
                    </button>
                    <button 
                      className="btn btn-secondary btn-lg"
                      onClick={stopCapturing}
                    >
                      <i className="fas fa-stop me-2"></i>
                      Stop Camera
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Results</h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {recognitionResult && (
                <div className={`alert ${recognitionResult.success ? 'alert-success' : 'alert-warning'}`}>
                  <h6>
                    <i className={`fas ${recognitionResult.success ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                    Recognition Result
                  </h6>
                  <p className="mb-2">{recognitionResult.message}</p>
                  
                  {recognitionResult.success && recognitionResult.attendanceMarked && (
                    <div>
                      <strong>Attendance Marked:</strong>
                      <ul className="list-unstyled mt-2">
                        {recognitionResult.attendanceMarked.map((attendance, index) => (
                          <li key={index} className="text-success">
                            <i className="fas fa-check me-2"></i>
                            {attendance.personName} - {attendance.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {lastCapturedImage && (
                <div className="mt-3">
                  <h6>Last Captured Image:</h6>
                  <img 
                    src={lastCapturedImage} 
                    alt="Last captured" 
                    className="img-fluid border rounded"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMarker;