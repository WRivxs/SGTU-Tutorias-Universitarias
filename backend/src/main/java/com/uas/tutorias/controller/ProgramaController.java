package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Programa;
import com.uas.tutorias.service.ProgramaService;
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
@RequestMapping("/api/programas")
@RequiredArgsConstructor
@Tag(name = "Programas", description = "Gestión de los programas académicos universitarios")
public class ProgramaController {

    private final ProgramaService programaService;

    // GET /api/programas?facultadId=1
    @Operation(summary = "Listar programas académicos", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping
    public ResponseEntity<List<Programa>> listar(
            @RequestParam(required = false) Long facultadId,
            @RequestParam(required = false) Boolean estado) {
        if (facultadId != null) {
            return ResponseEntity.ok(programaService.listarPorFacultad(facultadId));
        }
        if (estado != null) {
            return ResponseEntity.ok(programaService.listarPorEstado(estado));
        }
        return ResponseEntity.ok(programaService.listarTodos());
    }

    // GET /api/programas/{id}
    @Operation(summary = "Obtener programa por ID", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Programa> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(programaService.obtenerPorId(id));
    }

    // POST /api/programas
    @Operation(summary = "Crear programa", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<Programa> crear(@Valid @RequestBody Programa programa) {
        Programa guardado = programaService.crear(programa);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // PUT /api/programas/{id}
    @Operation(summary = "Actualizar programa", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Programa> actualizar(@PathVariable Long id, @Valid @RequestBody Programa datos) {
        Programa actualizado = programaService.actualizar(id, datos);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE /api/programas/{id}
    @Operation(summary = "Eliminar programa", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        programaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
