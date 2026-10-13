export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol: 'ADMINISTRADOR' | 'TUTOR' | 'ESTUDIANTE';
  estado?: boolean;
  activo?: boolean;
}
