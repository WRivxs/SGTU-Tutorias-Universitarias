package com.uas.tutorias.controller;

import com.uas.tutorias.entity.Usuario;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // GET /api/usuarios
    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    // GET /api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        return ResponseEntity.ok(usuario);
    }

    // POST /api/usuarios
    @PostMapping
    public ResponseEntity<Usuario> crear(@Valid @RequestBody Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Usuario guardado = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // PUT /api/usuarios/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @Valid @RequestBody Usuario datos) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        usuario.setNombre(datos.getNombre());
        usuario.setApellido(datos.getApellido());
        usuario.setCorreo(datos.getCorreo());
        usuario.setRol(datos.getRol());
        usuario.setEstado(datos.getEstado());
        return ResponseEntity.ok(usuarioRepository.save(usuario));
    }

    // DELETE /api/usuarios/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        usuarioRepository.delete(usuario);
        return ResponseEntity.noContent().build();
    }
}
