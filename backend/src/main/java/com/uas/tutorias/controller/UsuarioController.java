package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.service.UsuarioService;
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
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema (exclusivo para rol ADMINISTRADOR)")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // GET /api/usuarios
    @Operation(summary = "Listar todos los usuarios", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    // GET /api/usuarios/{id}
    @Operation(summary = "Obtener usuario por ID", description = "Disponible para ADMINISTRADOR, TUTOR y ESTUDIANTE")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('TUTOR') or hasRole('ESTUDIANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    // POST /api/usuarios
    @Operation(summary = "Crear nuevo usuario", description = "Exclusivo para ADMINISTRADOR. Encripta la contraseña y asigna rol")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<Usuario> crear(@Valid @RequestBody Usuario usuario) {
        Usuario guardado = usuarioService.crear(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // PUT /api/usuarios/{id}
    @Operation(summary = "Actualizar usuario", description = "Disponible para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @Valid @RequestBody Usuario datos) {
        Usuario actualizado = usuarioService.actualizar(id, datos);
        return ResponseEntity.ok(actualizado);
    }

    // PATCH /api/usuarios/{id}/estado?activo=true
    @Operation(summary = "Activar o desactivar usuario", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Usuario> cambiarEstado(@PathVariable Long id, @RequestParam Boolean activo) {
        return ResponseEntity.ok(usuarioService.cambiarEstado(id, activo));
    }

    // DELETE /api/usuarios/{id}
    @Operation(summary = "Eliminar usuario", description = "Disponible solo para ADMINISTRADOR")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
