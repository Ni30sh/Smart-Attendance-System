package com.smartattendance.controller;

import com.smartattendance.dto.AttendanceDto;
import com.smartattendance.dto.FaceRecognitionRequest;
import com.smartattendance.dto.FaceRecognitionResponse;
import com.smartattendance.entity.Attendance;
import com.smartattendance.service.AttendanceService;
import com.smartattendance.service.FaceRecognitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceService;
    
    @Autowired
    private FaceRecognitionService faceRecognitionService;
    
    @GetMapping("/today")
    public ResponseEntity<List<AttendanceDto>> getTodayAttendance() {
        List<AttendanceDto> attendance = attendanceService.getTodayAttendance();
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByDate(@PathVariable String date) {
        List<AttendanceDto> attendance = attendanceService.getAttendanceByDate(date);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/dates")
    public ResponseEntity<List<String>> getAllDates() {
        List<String> dates = attendanceService.getAllDates();
        return ResponseEntity.ok(dates);
    }
    
    @PostMapping("/mark")
    public ResponseEntity<AttendanceDto> markAttendance(
            @RequestParam String personName,
            @RequestParam Attendance.AttendanceStatus status) {
        AttendanceDto attendance = attendanceService.markAttendance(personName, status);
        return ResponseEntity.ok(attendance);
    }
    
    @PostMapping("/mark-by-face")
    public ResponseEntity<?> markAttendanceByFace(@RequestBody FaceRecognitionRequest request) {
        try {
            FaceRecognitionResponse response = faceRecognitionService.recognizeFaces(request.getImageData()).block();
            
            if (response != null && response.isSuccess() && response.getRecognizedPersons() != null) {
                List<AttendanceDto> markedAttendance = attendanceService.markMultipleAttendance(response.getRecognizedPersons());
                return ResponseEntity.ok(markedAttendance);
            } else {
                return ResponseEntity.badRequest().body(response != null ? response.getMessage() : "Face recognition failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing face recognition: " + e.getMessage());
        }
    }
    
    @GetMapping("/export/csv")
    public ResponseEntity<String> exportAttendanceToCSV(@RequestParam(required = false) String date) {
        try {
            String targetDate = date != null ? date : LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
            String csvContent = attendanceService.exportAttendanceToCSV(targetDate);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "attendance_" + targetDate + ".csv");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(csvContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error exporting CSV: " + e.getMessage());
        }
    }
}