package com.smartattendance.dto;

import com.smartattendance.entity.Attendance;
import java.time.LocalDateTime;

public class AttendanceDto {
    private Long id;
    private String personName;
    private Attendance.AttendanceStatus status;
    private LocalDateTime time;
    private String date;
    
    // Constructors
    public AttendanceDto() {}
    
    public AttendanceDto(Attendance attendance) {
        this.id = attendance.getId();
        this.personName = attendance.getPersonName();
        this.status = attendance.getStatus();
        this.time = attendance.getTime();
        this.date = attendance.getDate();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPersonName() {
        return personName;
    }
    
    public void setPersonName(String personName) {
        this.personName = personName;
    }
    
    public Attendance.AttendanceStatus getStatus() {
        return status;
    }
    
    public void setStatus(Attendance.AttendanceStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getTime() {
        return time;
    }
    
    public void setTime(LocalDateTime time) {
        this.time = time;
    }
    
    public String getDate() {
        return date;
    }
    
    public void setDate(String date) {
        this.date = date;
    }
}