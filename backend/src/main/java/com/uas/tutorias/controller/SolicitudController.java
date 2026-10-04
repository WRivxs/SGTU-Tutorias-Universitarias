package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Solicitud;
import com.uas.tutorias.service.SolicitudService;
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
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
@Tag(name = "Solicitudes", description = "Gestión de solicitudes de tutoría enviadas por estudiantes a tutores")
public class SolicitudController {

    private final SolicitudService solicitudService;

    // GET /api/solicitudes?estudianteId=1
    @Operation(summary = "Listar solicitudes", description = "Disponible para todos los roles autenticados. Permite filtrar por estudianteId")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR') or hasRole('ESTUDIANTE')")
    @GetMapping
    public ResponseEntity<List<Solicitud>> listar(@RequestParam(required = false) Long estudianteId) {
        if (estudianteId != null) {
            return ResponseEntity.ok(solicitudService.listarPorEstudiante(estudianteId));
        }
        return ResponseEntity.ok(solicitudService.listarTodas());
    }

    // GET /api/solicitudes/{id}
    @Operation(summary = "Obtener solicitud por ID", description = "Disponible para todos los roles autenticados")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR') or hasRole('ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.obtenerPorId(id));
    }

    // POST /api/solicitudes
    @Operation(summary = "Crear solicitud de tutoría", description = "Disponible exclusivamente para rol ESTUDIANTE")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    @PostMapping
    public ResponseEntity<Solicitud> crear(@Valid @RequestBody Solicitud solicitud) {
        Solicitud guardada = solicitudService.crear(solicitud);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // PUT /api/solicitudes/{id}
    @Operation(summary = "Actualizar solicitud", description = "Disponible para ADMINISTRADOR y ESTUDIANTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('ESTUDIANTE')")
    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> actualizar(@PathVariable Long id, @Valid @RequestBody Solicitud datos) {
        Solicitud actualizada = solicitudService.actualizar(id, datos);
        return ResponseEntity.ok(actualizada);
    }

    // PATCH /api/solicitudes/{id}/responder?estado=ACEPTADA&comentario=...
    @Operation(summary = "Responder a una solicitud (Aceptar o Rechazar)", description = "Disponible para ADMINISTRADOR y TUTOR responsable")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR')")
    @PatchMapping("/{id}/responder")
    public ResponseEntity<Solicitud> responder(
            @PathVariable Long id,
            @RequestParam Solicitud.Estado estado,
            @RequestParam(required = false) String comentario) {
        return ResponseEntity.ok(solicitudService.cambiarEstado(id, estado, comentario));
    }

    // DELETE /api/solicitudes/{id}
    @Operation(summary = "Eliminar o cancelar solicitud", description = "Disponible para ADMINISTRADOR y ESTUDIANTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('ESTUDIANTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        solicitudService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
