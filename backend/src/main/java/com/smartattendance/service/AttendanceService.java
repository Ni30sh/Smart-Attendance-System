package com.smartattendance.service;

import com.smartattendance.dto.AttendanceDto;
import com.smartattendance.entity.Attendance;
import com.smartattendance.entity.Person;
import com.smartattendance.repository.AttendanceRepository;
import com.smartattendance.repository.PersonRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private PersonRepository personRepository;
    
    public List<AttendanceDto> getTodayAttendance() {
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        return attendanceRepository.findByDateOrderByTimeDesc(today)
                .stream()
                .map(AttendanceDto::new)
                .collect(Collectors.toList());
    }
    
    public List<AttendanceDto> getAttendanceByDate(String date) {
        return attendanceRepository.findByDateOrderByTimeDesc(date)
                .stream()
                .map(AttendanceDto::new)
                .collect(Collectors.toList());
    }
    
    public List<String> getAllDates() {
        return attendanceRepository.findAllDates();
    }
    
    public AttendanceDto markAttendance(String personName, Attendance.AttendanceStatus status) {
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        
        // Check if attendance already exists for today
        Optional<Attendance> existingAttendance = attendanceRepository.findByPersonNameAndDate(personName, today);
        
        Attendance attendance;
        if (existingAttendance.isPresent()) {
            // Update existing attendance
            attendance = existingAttendance.get();
            attendance.setStatus(status);
        } else {
            // Create new attendance record
            attendance = new Attendance(personName, status, today);
        }
        
        attendance = attendanceRepository.save(attendance);
        return new AttendanceDto(attendance);
    }
    
    public String exportAttendanceToCSV(String date) throws IOException {
        List<Attendance> attendanceList = attendanceRepository.findByDateOrderByTimeDesc(date);
        
        StringWriter stringWriter = new StringWriter();
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader("ID", "Person Name", "Status", "Time")
                .build();
        
        try (CSVPrinter csvPrinter = new CSVPrinter(stringWriter, csvFormat)) {
            for (Attendance attendance : attendanceList) {
                csvPrinter.printRecord(
                        attendance.getId(),
                        attendance.getPersonName(),
                        attendance.getStatus(),
                        attendance.getTime()
                );
            }
        }
        
        return stringWriter.toString();
    }
    
    public List<AttendanceDto> markMultipleAttendance(List<String> recognizedPersons) {
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        
        return recognizedPersons.stream()
                .map(personName -> markAttendance(personName, Attendance.AttendanceStatus.Present))
                .collect(Collectors.toList());
    }
}