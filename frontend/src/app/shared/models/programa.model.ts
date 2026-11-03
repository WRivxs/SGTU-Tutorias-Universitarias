import { Facultad } from './facultad.model';

/**
 * Modelo de Programa Académico / Carrera Universitaria
 * Agregado según corrección del docente: pertenece a una Facultad (1:N).
 */
export interface Programa {
  id?: number;
  facultad?: Facultad;
  nombre: string;
  codigo: string;
  descripcion?: string;
  estado?: boolean;
}
