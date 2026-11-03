import { Usuario } from './usuario.model';
import { Materia } from './materia.model';

/**
 * Modelo de Docente (antes Tutor)
 * Formalizado según corrección del docente:
 * - Vinculado a un Usuario con rol DOCENTE
 * - Especialidad académica
 * - Lista de asignaturas autorizadas/asignadas que puede dictar (N:M)
 */
export interface Docente {
  id?: number;
  usuario?: Usuario;
  especialidad?: string;
  descripcion?: string;
  disponibilidad?: string;
  materias?: Materia[];
}
