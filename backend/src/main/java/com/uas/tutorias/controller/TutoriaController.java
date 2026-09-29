package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Tutoria;
import com.uas.tutorias.service.TutoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutorias")
@RequiredArgsConstructor
public class TutoriaController {

    private final TutoriaService tutoriaService;

    // GET /api/tutorias?estado=DISPONIBLE&materiaId=1
    @GetMapping
    public ResponseEntity<List<Tutoria>> listar(
            @RequestParam(required = false) Tutoria.Estado estado,
            @RequestParam(required = false) Long materiaId) {
        if (estado != null) {
            return ResponseEntity.ok(tutoriaService.listarPorEstado(estado));
        }
        if (materiaId != null) {
            return ResponseEntity.ok(tutoriaService.listarPorMateria(materiaId));
        }
        return ResponseEntity.ok(tutoriaService.listarTodas());
    }

    // GET /api/tutorias/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Tutoria> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(tutoriaService.obtenerPorId(id));
    }

    // POST /api/tutorias
    @PostMapping
    public ResponseEntity<Tutoria> crear(@Valid @RequestBody Tutoria tutoria) {
        Tutoria guardada = tutoriaService.crear(tutoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/tutorias/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Tutoria> actualizar(@PathVariable Long id, @Valid @RequestBody Tutoria datos) {
        Tutoria actualizada = tutoriaService.actualizar(id, datos);
        return ResponseEntity.ok(actualizada);
    }

    // PATCH /api/tutorias/{id}/estado?estado=CANCELADA
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Tutoria> cambiarEstado(@PathVariable Long id, @RequestParam Tutoria.Estado estado) {
        return ResponseEntity.ok(tutoriaService.cambiarEstado(id, estado));
    }

    // DELETE /api/tutorias/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tutoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
