package com.smartattendance.dto;

public class FaceRecognitionRequest {
    private String imageData; // Base64 encoded image
    
    public FaceRecognitionRequest() {}
    
    public FaceRecognitionRequest(String imageData) {
        this.imageData = imageData;
    }
    
    public String getImageData() {
        return imageData;
    }
    
    public void setImageData(String imageData) {
        this.imageData = imageData;
    }
}