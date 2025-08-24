package com.smartattendance.repository;

import com.smartattendance.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByPersonName(String personName);
    boolean existsByPersonName(String personName);
}