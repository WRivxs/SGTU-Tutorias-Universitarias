package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Materia;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.MateriaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    @Autowired
    private MateriaRepository materiaRepository;

    // GET /api/materias
    @GetMapping
    public List<Materia> listar() {
        return materiaRepository.findAll();
    }

    // GET /api/materias/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Materia> obtener(@PathVariable Long id) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + id));
        return ResponseEntity.ok(materia);
    }

    // POST /api/materias
    @PostMapping
    public ResponseEntity<Materia> crear(@Valid @RequestBody Materia materia) {
        Materia guardada = materiaRepository.save(materia);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/materias/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Materia> actualizar(@PathVariable Long id, @Valid @RequestBody Materia datos) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + id));
        materia.setNombre(datos.getNombre());
        materia.setDescripcion(datos.getDescripcion());
        materia.setEstado(datos.getEstado());
        return ResponseEntity.ok(materiaRepository.save(materia));
    }

    // DELETE /api/materias/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + id));
        materiaRepository.delete(materia);
        return ResponseEntity.noContent().build();
    }
}
