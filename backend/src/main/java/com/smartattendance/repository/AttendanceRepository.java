package com.smartattendance.repository;

import com.smartattendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByDateOrderByTimeDesc(String date);
    
    Optional<Attendance> findByPersonNameAndDate(String personName, String date);
    
    @Query("SELECT a FROM Attendance a WHERE a.date = :date")
    List<Attendance> findTodayAttendance(@Param("date") String date);
    
    @Query("SELECT DISTINCT a.date FROM Attendance a ORDER BY a.date DESC")
    List<String> findAllDates();
}