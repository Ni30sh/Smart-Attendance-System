package com.smartattendance.service;

import com.smartattendance.entity.Person;
import com.smartattendance.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PersonService {
    
    @Autowired
    private PersonRepository personRepository;
    
    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }
    
    public Optional<Person> getPersonByName(String personName) {
        return personRepository.findByPersonName(personName);
    }
    
    public Person savePerson(Person person) {
        return personRepository.save(person);
    }
    
    public Person savePersonWithEncoding(String personName, byte[] encoding) {
        Optional<Person> existingPerson = personRepository.findByPersonName(personName);
        
        if (existingPerson.isPresent()) {
            // Update existing person's encoding
            Person person = existingPerson.get();
            person.setEncoding(encoding);
            return personRepository.save(person);
        } else {
            // Create new person
            Person person = new Person(personName, encoding);
            return personRepository.save(person);
        }
    }
    
    public boolean personExists(String personName) {
        return personRepository.existsByPersonName(personName);
    }
    
    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }
}