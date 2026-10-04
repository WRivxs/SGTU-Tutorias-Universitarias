package com.uas.tutorias.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    @Builder.Default
    private String tipo = "Bearer";
    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
}
