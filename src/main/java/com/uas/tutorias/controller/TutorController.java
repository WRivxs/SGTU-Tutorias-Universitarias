package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Tutor;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.TutorRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutores")
public class TutorController {

    @Autowired
    private TutorRepository tutorRepository;

    @GetMapping
    public List<Tutor> listar() {
        return tutorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutor> obtener(@PathVariable Long id) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado con id: " + id));
        return ResponseEntity.ok(tutor);
    }

    @PostMapping
    public ResponseEntity<Tutor> crear(@Valid @RequestBody Tutor tutor) {
        Tutor guardado = tutorRepository.save(tutor);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tutor> actualizar(@PathVariable Long id, @Valid @RequestBody Tutor datos) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado con id: " + id));
        tutor.setEspecialidad(datos.getEspecialidad());
        tutor.setDescripcion(datos.getDescripcion());
        tutor.setDisponibilidad(datos.getDisponibilidad());
        return ResponseEntity.ok(tutorRepository.save(tutor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado con id: " + id));
        tutorRepository.delete(tutor);
        return ResponseEntity.noContent().build();
    }
}
