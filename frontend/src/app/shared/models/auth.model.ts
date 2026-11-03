import { RolUsuario } from './usuario.model';

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: RolUsuario;
}

export interface UsuarioSesion {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: RolUsuario;
}
