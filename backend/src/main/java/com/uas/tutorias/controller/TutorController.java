package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Tutor;
import com.uas.tutorias.service.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutores")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    // GET /api/tutores
    @GetMapping
    public ResponseEntity<List<Tutor>> listar() {
        return ResponseEntity.ok(tutorService.listarTodos());
    }

    // GET /api/tutores/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Tutor> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(tutorService.obtenerPorId(id));
    }

    // GET /api/tutores/usuario/{usuarioId}
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Tutor> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(tutorService.obtenerPorUsuarioId(usuarioId));
    }

    // POST /api/tutores
    @PostMapping
    public ResponseEntity<Tutor> crear(@Valid @RequestBody Tutor tutor) {
        Tutor guardado = tutorService.crear(tutor);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // PUT /api/tutores/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Tutor> actualizar(@PathVariable Long id, @Valid @RequestBody Tutor datos) {
        Tutor actualizado = tutorService.actualizar(id, datos);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE /api/tutores/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tutorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
