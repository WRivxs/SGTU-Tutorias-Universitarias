package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Tutoria;
import com.uas.tutorias.service.TutoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutorias")
@RequiredArgsConstructor
@Tag(name = "Tutorías", description = "Programación y consulta de sesiones de tutoría por programa, semestre y docente")
public class TutoriaController {

    private final TutoriaService tutoriaService;

    // GET /api/tutorias?programaId=1&semestre=5&estado=DISPONIBLE
    @Operation(summary = "Listar tutorías con filtros", description = "Disponible para todos los roles autenticados. Permite filtros por programa académico, semestre, materia, docente y estado")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping
    public ResponseEntity<List<Tutoria>> listar(
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) Integer semestre,
            @RequestParam(required = false) Long materiaId,
            @RequestParam(required = false) Long docenteId,
            @RequestParam(required = false) Tutoria.Estado estado) {
        return ResponseEntity.ok(tutoriaService.listarConFiltros(programaId, semestre, materiaId, docenteId, estado));
    }

    // GET /api/tutorias/{id}
    @Operation(summary = "Obtener tutoría por ID", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Tutoria> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(tutoriaService.obtenerPorId(id));
    }

    // POST /api/tutorias
    @Operation(summary = "Crear o programar tutoría", description = "Disponible para ADMINISTRADOR y DOCENTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE')")
    @PostMapping
    public ResponseEntity<Tutoria> crear(@Valid @RequestBody Tutoria tutoria) {
        Tutoria guardada = tutoriaService.crear(tutoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/tutorias/{id}
    @Operation(summary = "Actualizar tutoría", description = "Disponible para ADMINISTRADOR y DOCENTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE')")
    @PutMapping("/{id}")
    public ResponseEntity<Tutoria> actualizar(@PathVariable Long id, @Valid @RequestBody Tutoria datos) {
        Tutoria actualizada = tutoriaService.actualizar(id, datos);
        return ResponseEntity.ok(actualizada);
    }

    // PATCH /api/tutorias/{id}/estado?estado=CANCELADA
    @Operation(summary = "Cambiar estado de tutoría", description = "Disponible para ADMINISTRADOR y DOCENTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Tutoria> cambiarEstado(@PathVariable Long id, @RequestParam Tutoria.Estado estado) {
        return ResponseEntity.ok(tutoriaService.cambiarEstado(id, estado));
    }

    // DELETE /api/tutorias/{id}
    @Operation(summary = "Eliminar tutoría", description = "Disponible para ADMINISTRADOR y DOCENTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tutoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
