import { Usuario } from './usuario.model';
import { Programa } from './programa.model';

/**
 * Modelo de Estudiante
 * Agregado según corrección del docente:
 * - Vinculado a un Usuario con rol ESTUDIANTE
 * - Pertenece a un Programa Académico / Carrera
 * - Semestre actual de referencia (1 al 10)
 * - Código estudiantil único
 */
export interface Estudiante {
  id?: number;
  usuario?: Usuario;
  programa?: Programa;
  semestreActual: number;
  codigoEstudiantil: string;
}
