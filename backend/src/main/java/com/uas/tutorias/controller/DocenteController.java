package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Docente;
import com.uas.tutorias.service.DocenteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/docentes")
@RequiredArgsConstructor
@Tag(name = "Docentes", description = "Gestión del perfil académico y asignación de materias a docentes")
public class DocenteController {

    private final DocenteService docenteService;

    // GET /api/docentes
    @Operation(summary = "Listar docentes", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping
    public ResponseEntity<List<Docente>> listar() {
        return ResponseEntity.ok(docenteService.listarTodos());
    }

    // GET /api/docentes/{id}
    @Operation(summary = "Obtener docente por ID", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Docente> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(docenteService.obtenerPorId(id));
    }

    // GET /api/docentes/usuario/{usuarioId}
    @Operation(summary = "Obtener perfil de docente por ID de usuario", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Docente> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(docenteService.obtenerPorUsuarioId(usuarioId));
    }

    // POST /api/docentes
    @Operation(summary = "Crear perfil de docente", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<Docente> crear(@Valid @RequestBody Docente docente) {
        Docente guardado = docenteService.crear(docente);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // PUT /api/docentes/{id}
    @Operation(summary = "Actualizar perfil de docente", description = "Disponible para ADMINISTRADOR y DOCENTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE')")
    @PutMapping("/{id}")
    public ResponseEntity<Docente> actualizar(@PathVariable Long id, @Valid @RequestBody Docente datos) {
        Docente actualizado = docenteService.actualizar(id, datos);
        return ResponseEntity.ok(actualizado);
    }

    // PUT /api/docentes/{id}/materias
    @Operation(summary = "Asignar materias autorizadas a un docente", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}/materias")
    public ResponseEntity<Docente> asignarMaterias(@PathVariable Long id, @RequestBody Set<Long> materiasIds) {
        Docente actualizado = docenteService.asignarMaterias(id, materiasIds);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE /api/docentes/{id}/materias/{materiaId}
    @Operation(summary = "Remover materia autorizada de un docente", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}/materias/{materiaId}")
    public ResponseEntity<Docente> removerMateria(@PathVariable Long id, @PathVariable Long materiaId) {
        Docente actualizado = docenteService.removerMateria(id, materiaId);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE /api/docentes/{id}
    @Operation(summary = "Eliminar docente", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        docenteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
