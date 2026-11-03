package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Estudiante;
import com.uas.tutorias.service.EstudianteService;
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
@RequestMapping("/api/estudiantes")
@RequiredArgsConstructor
@Tag(name = "Estudiantes", description = "Gestión del perfil académico de los estudiantes")
public class EstudianteController {

    private final EstudianteService estudianteService;

    // GET /api/estudiantes?programaId=1
    @Operation(summary = "Listar estudiantes", description = "Disponible para ADMINISTRADOR y DOCENTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE')")
    @GetMapping
    public ResponseEntity<List<Estudiante>> listar(@RequestParam(required = false) Long programaId) {
        if (programaId != null) {
            return ResponseEntity.ok(estudianteService.listarPorPrograma(programaId));
        }
        return ResponseEntity.ok(estudianteService.listarTodos());
    }

    // GET /api/estudiantes/{id}
    @Operation(summary = "Obtener estudiante por ID", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteService.obtenerPorId(id));
    }

    // GET /api/estudiantes/usuario/{usuarioId}
    @Operation(summary = "Obtener perfil de estudiante por ID de usuario", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Estudiante> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(estudianteService.obtenerPorUsuarioId(usuarioId));
    }

    // POST /api/estudiantes
    @Operation(summary = "Crear perfil de estudiante", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<Estudiante> crear(@Valid @RequestBody Estudiante estudiante) {
        Estudiante guardado = estudianteService.crear(estudiante);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // PUT /api/estudiantes/{id}
    @Operation(summary = "Actualizar perfil de estudiante", description = "Disponible para ADMINISTRADOR y ESTUDIANTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('ESTUDIANTE')")
    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> actualizar(@PathVariable Long id, @Valid @RequestBody Estudiante datos) {
        Estudiante actualizado = estudianteService.actualizar(id, datos);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE /api/estudiantes/{id}
    @Operation(summary = "Eliminar estudiante", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        estudianteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
