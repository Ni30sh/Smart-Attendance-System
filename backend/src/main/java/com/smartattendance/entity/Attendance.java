package com.smartattendance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "person_name", nullable = false)
    private String personName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;
    
    @Column(name = "time", nullable = false)
    private LocalDateTime time = LocalDateTime.now();
    
    @Column(name = "date", nullable = false)
    private String date; // Format: YYYY-MM-DD
    
    // Constructors
    public Attendance() {}
    
    public Attendance(String personName, AttendanceStatus status, String date) {
        this.personName = personName;
        this.status = status;
        this.date = date;
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
    
    public AttendanceStatus getStatus() {
        return status;
    }
    
    public void setStatus(AttendanceStatus status) {
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
    
    public enum AttendanceStatus {
        Present, Absent
    }
}