export type RolUsuario = 'ADMINISTRADOR' | 'DOCENTE' | 'TUTOR' | 'ESTUDIANTE';

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol: RolUsuario;
  telefono?: string;
  estado?: boolean;
  activo?: boolean;
}
