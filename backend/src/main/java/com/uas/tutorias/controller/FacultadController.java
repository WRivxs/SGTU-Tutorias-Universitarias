package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Facultad;
import com.uas.tutorias.service.FacultadService;
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
@RequestMapping("/api/facultades")
@RequiredArgsConstructor
@Tag(name = "Facultades", description = "Gestión de las facultades universitarias")
public class FacultadController {

    private final FacultadService facultadService;

    // GET /api/facultades
    @Operation(summary = "Listar facultades", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping
    public ResponseEntity<List<Facultad>> listar(@RequestParam(required = false) Boolean estado) {
        if (estado != null) {
            return ResponseEntity.ok(facultadService.listarPorEstado(estado));
        }
        return ResponseEntity.ok(facultadService.listarTodas());
    }

    // GET /api/facultades/{id}
    @Operation(summary = "Obtener facultad por ID", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Facultad> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(facultadService.obtenerPorId(id));
    }

    // POST /api/facultades
    @Operation(summary = "Crear facultad", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<Facultad> crear(@Valid @RequestBody Facultad facultad) {
        Facultad guardada = facultadService.crear(facultad);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/facultades/{id}
    @Operation(summary = "Actualizar facultad", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Facultad> actualizar(@PathVariable Long id, @Valid @RequestBody Facultad datos) {
        Facultad actualizada = facultadService.actualizar(id, datos);
        return ResponseEntity.ok(actualizada);
    }

    // DELETE /api/facultades/{id}
    @Operation(summary = "Eliminar facultad", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        facultadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
