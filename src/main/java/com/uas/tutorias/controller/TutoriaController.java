package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Tutoria;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.TutoriaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutorias")
public class TutoriaController {

    @Autowired
    private TutoriaRepository tutoriaRepository;

    // GET /api/tutorias
    @GetMapping
    public List<Tutoria> listar() {
        return tutoriaRepository.findAll();
    }

    // GET /api/tutorias/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Tutoria> obtener(@PathVariable Long id) {
        Tutoria tutoria = tutoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoria no encontrada con id: " + id));
        return ResponseEntity.ok(tutoria);
    }

    // POST /api/tutorias
    @PostMapping
    public ResponseEntity<Tutoria> crear(@Valid @RequestBody Tutoria tutoria) {
        Tutoria guardada = tutoriaRepository.save(tutoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/tutorias/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Tutoria> actualizar(@PathVariable Long id, @Valid @RequestBody Tutoria datos) {
        Tutoria tutoria = tutoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoria no encontrada con id: " + id));
        tutoria.setTutor(datos.getTutor());
        tutoria.setMateria(datos.getMateria());
        tutoria.setFecha(datos.getFecha());
        tutoria.setHora(datos.getHora());
        tutoria.setModalidad(datos.getModalidad());
        tutoria.setLugar(datos.getLugar());
        tutoria.setDescripcion(datos.getDescripcion());
        tutoria.setEstado(datos.getEstado());
        return ResponseEntity.ok(tutoriaRepository.save(tutoria));
    }

    // DELETE /api/tutorias/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Tutoria tutoria = tutoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoria no encontrada con id: " + id));
        tutoriaRepository.delete(tutoria);
        return ResponseEntity.noContent().build();
    }
}
