package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Tutor;
import com.uas.tutorias.service.TutorService;
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
@RequestMapping("/api/tutores")
@RequiredArgsConstructor
@Tag(name = "Tutores", description = "Gestión de perfiles de tutores académicos")
public class TutorController {

    private final TutorService tutorService;

    // GET /api/tutores
    @Operation(summary = "Listar tutores", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR') or hasRole('ESTUDIANTE')")
    @GetMapping
    public ResponseEntity<List<Tutor>> listar() {
        return ResponseEntity.ok(tutorService.listarTodos());
    }

    // GET /api/tutores/{id}
    @Operation(summary = "Obtener tutor por ID", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR') or hasRole('ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Tutor> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(tutorService.obtenerPorId(id));
    }

    // GET /api/tutores/usuario/{usuarioId}
    @Operation(summary = "Obtener perfil de tutor por ID de usuario", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR') or hasRole('ESTUDIANTE')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Tutor> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(tutorService.obtenerPorUsuarioId(usuarioId));
    }

    // POST /api/tutores
    @Operation(summary = "Crear perfil de tutor", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<Tutor> crear(@Valid @RequestBody Tutor tutor) {
        Tutor guardado = tutorService.crear(tutor);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // PUT /api/tutores/{id}
    @Operation(summary = "Actualizar perfil de tutor", description = "Disponible para ADMINISTRADOR y TUTOR")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Tutor> actualizar(@PathVariable Long id, @Valid @RequestBody Tutor datos) {
        Tutor actualizado = tutorService.actualizar(id, datos);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE /api/tutores/{id}
    @Operation(summary = "Eliminar tutor", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tutorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
