package com.smartattendance.dto;

import java.util.List;

public class FaceRecognitionResponse {
    private List<String> recognizedPersons;
    private boolean success;
    private String message;
    
    public FaceRecognitionResponse() {}
    
    public FaceRecognitionResponse(List<String> recognizedPersons, boolean success, String message) {
        this.recognizedPersons = recognizedPersons;
        this.success = success;
        this.message = message;
    }
    
    public List<String> getRecognizedPersons() {
        return recognizedPersons;
    }
    
    public void setRecognizedPersons(List<String> recognizedPersons) {
        this.recognizedPersons = recognizedPersons;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}