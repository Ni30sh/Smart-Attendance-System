package com.smartattendance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "images_table")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "person_name", unique = true, nullable = false)
    private String personName;
    
    @Lob
    @Column(name = "encoding", columnDefinition = "LONGBLOB")
    private byte[] encoding;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public Person() {}
    
    public Person(String personName, byte[] encoding) {
        this.personName = personName;
        this.encoding = encoding;
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
    
    public byte[] getEncoding() {
        return encoding;
    }
    
    public void setEncoding(byte[] encoding) {
        this.encoding = encoding;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}