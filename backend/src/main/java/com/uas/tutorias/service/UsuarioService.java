package com.uas.tutorias.service;

import com.uas.tutorias.entity.Usuario;

import java.util.List;

public interface UsuarioService {
    List<Usuario> listarTodos();
    Usuario obtenerPorId(Long id);
    Usuario obtenerPorCorreo(String correo);
    Usuario crear(Usuario usuario);
    Usuario actualizar(Long id, Usuario datos);
    Usuario cambiarEstado(Long id, Boolean estado);
    void eliminar(Long id);
}
