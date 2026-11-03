/**
 * Modelo de Facultad Universitaria (Jerarquía Académica Base)
 * Agregado según corrección del docente para estructura universitaria.
 */
export interface Facultad {
  id?: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  estado?: boolean;
}
